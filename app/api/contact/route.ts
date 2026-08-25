import { NextResponse } from "next/server";

import { contactSchema, type FieldErrors } from "@/lib/contact-schema";

export const runtime = "nodejs";

/**
 * Naive fixed-window limiter, per instance. Enough to stop a bored script;
 * anything serious belongs at the edge (WAF / provider rate limits), not here.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
  }

  return entry.count > MAX_PER_WINDOW;
}

const CONTROL_CHARS = new RegExp("[\u0000-\u001F\u007F]", "g");

/** Strips control characters and collapses whitespace before anything is stored or sent. */
function sanitize(value: string) {
  return value.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim();
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions. Try again in a minute." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in errors)) {
        errors[field as keyof FieldErrors] = issue.message;
      }
    }
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot filled in — accept silently so the bot learns nothing.
  if (data.website) {
    return NextResponse.json({ ok: true, message: "Received." });
  }

  const enquiry = {
    receivedAt: new Date().toISOString(),
    projectType: data.projectType,
    goal: sanitize(data.goal),
    timeline: data.timeline,
    budget: data.budget,
    name: sanitize(data.name),
    email: data.email.toLowerCase(),
    phone: data.phone ? sanitize(data.phone) : null,
    company: data.company ? sanitize(data.company) : null,
    nda: Boolean(data.nda),
    source: "premiumwebagency.com",
  };

  // Delivery is intentionally left as a single seam. Wire a transactional
  // provider here using CONTACT_MAIL_API_KEY — it must stay server-side.
  const inbox = process.env.CONTACT_INBOX_EMAIL;
  if (!process.env.CONTACT_MAIL_API_KEY) {
    console.info("[contact] enquiry received (no mail provider configured)", {
      to: inbox ?? "unset",
      from: enquiry.email,
      projectType: enquiry.projectType,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Received. We'll reply within one business day.",
  });
}

export async function GET() {
  return NextResponse.json({ ok: false, message: "Method not allowed." }, { status: 405 });
}
