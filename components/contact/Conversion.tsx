"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { EASE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { pricing, type Plan } from "@/data/pricing";
import { contact, offer } from "@/data/site";

const INTENTS = [
  { id: "web", label: "A website", group: "web" },
  { id: "store", label: "An online store", group: "ecommerce" },
  { id: "brand", label: "A brand identity", group: "logo" },
  { id: "growth", label: "Traffic & growth", group: "seo" },
  { id: "portal", label: "A custom portal", group: "portal" },
] as const;

const BUDGETS = [
  { id: "starter", label: "Under $1k", ceiling: 1000 },
  { id: "core", label: "$1k – $3k", ceiling: 3000 },
  { id: "scale", label: "$3k – $6k", ceiling: 6000 },
  { id: "open", label: "$6k+", ceiling: Number.POSITIVE_INFINITY },
] as const;

const STEPS = ["Your project", "Scope match", "Recommended path", "Let's build"];

function priceOf(plan: Plan) {
  return Number(plan.price.replace(/[^0-9.]/g, ""));
}

/**
 * The conversion module. It is a deterministic match against the published
 * package list — not an estimate, and explicitly not billed as one. The copy
 * says exactly what it does, because a fake AI estimator would undercut the
 * one claim the whole site is making.
 */
export function Conversion() {
  const [intent, setIntent] = useState<(typeof INTENTS)[number]["id"] | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]["id"] | null>(null);

  const match = useMemo(() => {
    if (!intent || !budget) return null;
    const groupId = INTENTS.find((item) => item.id === intent)!.group;
    const group = pricing.find((item) => item.id === groupId);
    if (!group) return null;

    const ceiling = BUDGETS.find((item) => item.id === budget)!.ceiling;
    const sorted = [...group.plans].sort((a, b) => priceOf(a) - priceOf(b));
    // Best fit is the most complete package that still sits inside the band;
    // if nothing fits, we say so rather than silently upselling.
    const affordable = sorted.filter((plan) => priceOf(plan) <= ceiling);
    return {
      group,
      plan: affordable.at(-1) ?? null,
      cheapest: sorted[0],
    };
  }, [intent, budget]);

  const step = !intent ? 0 : !budget ? 1 : 2;

  return (
    <section
      id="start"
      aria-labelledby="conversion-heading"
      className="relative overflow-hidden border-t border-line bg-void py-28 lg:py-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 10%, color-mix(in oklab, var(--color-signal) 12%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="page relative grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Reveal>
            <span className="label !text-signal-bright">
              <span className="tabular-nums">10</span>
              <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
              Find your path
            </span>
          </Reveal>

          <h2
            id="conversion-heading"
            className="display mt-7 text-[length:var(--text-display-md)] text-bone"
          >
            Two questions.
            <br />
            <span className="text-gradient-bone">One route in.</span>
          </h2>

          <p className="mt-7 max-w-md leading-relaxed text-mute">
            Answer both and we&rsquo;ll point you at the published package that fits. It&rsquo;s a
            direct match against the pricing above — not an estimate, and nothing is charged.
          </p>

          {offer.active ? (
            <Reveal delay={0.1} className="mt-9">
              <div className="rounded-xl border border-line bg-tint/[0.03] p-5">
                <span className="label !text-signal-bright">{offer.headline}</span>
                <ul className="mt-4 flex flex-col gap-2">
                  {offer.inclusions.map((inclusion) => (
                    <li key={inclusion} className="flex items-start gap-2.5 text-sm text-bone-dim">
                      <span className="mt-[0.5rem] h-px w-2.5 shrink-0 bg-signal/70" aria-hidden />
                      {inclusion}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ) : null}

          {/* Flow rail */}
          <ol className="mt-10 flex flex-col gap-3">
            {STEPS.map((label, index) => (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                    index <= step ? "bg-signal-bright" : "bg-line",
                  )}
                />
                <span
                  className={cn(
                    "label transition-colors duration-500",
                    index <= step ? "!text-bone-dim" : "!text-faint",
                  )}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-line bg-gradient-to-b from-tint/[0.04] to-transparent p-7 lg:p-10">
          <fieldset>
            <legend className="label !text-bone">01 — What are we building?</legend>
            <div className="mt-5 flex flex-wrap gap-2">
              {INTENTS.map((item) => (
                <Chip
                  key={item.id}
                  selected={intent === item.id}
                  onClick={() => setIntent(item.id)}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-9">
            <legend className="label !text-bone">02 — What&rsquo;s the budget?</legend>
            <div className="mt-5 flex flex-wrap gap-2">
              {BUDGETS.map((item) => (
                <Chip
                  key={item.id}
                  selected={budget === item.id}
                  onClick={() => setBudget(item.id)}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="mt-10 min-h-[16rem] border-t border-line pt-8">
            <AnimatePresence mode="wait">
              {match?.plan ? (
                <motion.div
                  key={match.plan.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE.outExpo }}
                >
                  <span className="label !text-signal-bright">
                    Matched · {match.group.label}
                  </span>
                  <h3 className="display mt-4 text-[length:var(--text-display-sm)] text-bone">
                    {match.plan.name}
                  </h3>
                  <p className="mt-3 flex items-baseline gap-3">
                    <span className="font-mono text-2xl text-bone">{match.plan.price}</span>
                    {match.plan.was ? (
                      <span className="font-mono text-sm text-faint line-through">
                        {match.plan.was}
                      </span>
                    ) : null}
                  </p>
                  <ul className="mt-6 flex flex-col gap-2">
                    {match.plan.features.slice(0, 5).map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-bone-dim">
                        <span className="mt-[0.5rem] h-px w-2.5 shrink-0 bg-signal/70" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <ButtonLink href="#contact">Start a project</ButtonLink>
                    <ButtonLink href={contact.phoneHref} variant="line">
                      {contact.phone}
                    </ButtonLink>
                  </div>
                </motion.div>
              ) : match ? (
                <motion.div
                  key="no-match"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="label !text-signal-bright">No published fit</span>
                  <p className="mt-4 max-w-sm leading-relaxed text-bone-dim">
                    Nothing in {match.group.label.toLowerCase()} lands inside that band — the
                    entry package is {match.cheapest.name} at {match.cheapest.price}. Tell us the
                    constraint and we&rsquo;ll scope to it.
                  </p>
                  <ButtonLink href="#contact" className="mt-7">
                    Talk it through
                  </ButtonLink>
                </motion.div>
              ) : (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-sm text-sm leading-relaxed text-faint"
                >
                  Pick both and the matched package appears here.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-cursor="action"
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
        selected
          ? "border-signal-bright bg-signal/15 text-bone"
          : "border-line text-mute hover:border-bone/25 hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}
