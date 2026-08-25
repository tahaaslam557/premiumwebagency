import { z } from "zod";

export const PROJECT_TYPES = [
  "Website",
  "E-commerce store",
  "Web application",
  "Mobile app",
  "Brand & identity",
  "SEO & growth",
  "AI & automation",
  "Something else",
] as const;

export const TIMELINES = [
  "As soon as possible",
  "1–2 months",
  "3–6 months",
  "Still planning",
] as const;

export const BUDGETS = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $6,000",
  "$6,000 – $15,000",
  "$15,000+",
] as const;

/**
 * One schema, imported by the form and by the route handler. Client-side
 * validation is a convenience; the server re-runs this on every request and
 * trusts nothing that arrives.
 */
export const contactSchema = z.object({
  projectType: z.enum(PROJECT_TYPES, { message: "Choose what we're building." }),
  goal: z
    .string()
    .trim()
    .min(12, "Tell us a little more — at least a sentence.")
    .max(1200, "Keep it under 1200 characters."),
  timeline: z.enum(TIMELINES, { message: "Pick a timeline." }),
  budget: z.enum(BUDGETS, { message: "Pick a budget range." }),
  name: z.string().trim().min(2, "Enter your name.").max(80, "That name is too long."),
  email: z.email("Enter a valid email address.").max(160),
  phone: z
    .string()
    .trim()
    .max(32, "That phone number is too long.")
    .regex(/^[0-9+()\-.\s]*$/, "Use digits, spaces and + ( ) - only.")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  nda: z.boolean().optional(),
  // Honeypot. Deliberately permissive: the route decides what to do with a
  // filled value, so a bot gets a 200 and learns nothing, rather than a 422
  // that tells it exactly which field gave it away.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Steps the progressive form walks through, and which fields gate each one. */
export const STEPS: Array<{
  index: string;
  question: string;
  hint: string;
  fields: Array<keyof ContactInput>;
}> = [
  {
    index: "01",
    question: "What are we building?",
    hint: "Pick the closest fit — we'll refine it together.",
    fields: ["projectType"],
  },
  {
    index: "02",
    question: "What's the goal?",
    hint: "What should this do for the business once it's live?",
    fields: ["goal"],
  },
  {
    index: "03",
    question: "What's your timeline?",
    hint: "An honest answer here shapes the whole plan.",
    fields: ["timeline"],
  },
  {
    index: "04",
    question: "What's your budget?",
    hint: "A range is enough. It decides scope, not quality.",
    fields: ["budget"],
  },
  {
    index: "05",
    question: "Where should we contact you?",
    hint: "We reply within one business day.",
    fields: ["name", "email", "phone", "company"],
  },
];
