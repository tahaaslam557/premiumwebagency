"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { EASE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { combo, pricing, pricingNote, type Plan } from "@/data/pricing";
import { offer } from "@/data/site";

const PREVIEW_COUNT = 6;

function toNumber(value: string) {
  return Number(value.replace(/[^0-9.]/g, ""));
}

/** Percentage saved, only when the source actually lists an original price. */
function savedPercent(plan: Plan) {
  if (!plan.was) return null;
  const now = toNumber(plan.price);
  const before = toNumber(plan.was);
  if (!now || !before || before <= now) return null;
  return Math.round(((before - now) / before) * 100);
}

export function Pricing() {
  const [groupId, setGroupId] = useState(pricing[0].id);
  const group = pricing.find((item) => item.id === groupId) ?? pricing[0];

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative border-t border-line bg-void py-28 lg:py-36"
    >
      <div className="page">
        <SectionHeader
          titleId="pricing-heading"
          index="09"
          eyebrow="Packages"
          title={"Priced in\nthe open."}
          description={
            <>
              Every package Premium Web Agency publishes, with its current pricing.{" "}
              {offer.active ? (
                <span className="text-bone-dim">
                  Promotional pricing ({offer.headline}) is already applied below.
                </span>
              ) : null}
            </>
          }
        />

        {/* Category rail */}
        <Reveal
          delay={0.1}
          className="-mx-[var(--gutter)] mt-14 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div role="tablist" aria-label="Package categories" className="flex w-max gap-2">
            {pricing.map((item) => {
              const selected = item.id === groupId;
              return (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`panel-${item.id}`}
                  id={`tab-${item.id}`}
                  onClick={() => setGroupId(item.id)}
                  data-cursor="action"
                  className={cn(
                    "relative rounded-full border px-5 py-2.5 text-sm transition-colors duration-300",
                    selected
                      ? "border-transparent text-void"
                      : "border-line text-mute hover:border-bone/25 hover:text-bone",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="pricing-tab"
                      className="absolute inset-0 rounded-full bg-bone"
                      transition={{ duration: 0.45, ease: EASE.outExpo }}
                    />
                  ) : null}
                  <span className="relative flex items-center gap-2">
                    <span className="font-mono text-[0.625rem] opacity-60">{item.code}</span>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          id={`panel-${group.id}`}
          aria-labelledby={`tab-${group.id}`}
          className="mt-10"
        >
          <p className="max-w-xl text-sm leading-relaxed text-mute">{group.tagline}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE.outExpo }}
              className="mt-8 grid gap-px bg-line md:grid-cols-2 xl:grid-cols-3"
            >
              {group.plans.map((plan, index) => (
                <PlanCard key={plan.id} plan={plan} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Combo offer */}
        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-2xl border border-signal/30 bg-gradient-to-r from-signal/[0.12] to-transparent p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="label !text-signal-bright">Combo package · {combo.discount}</span>
                <h3 className="display mt-4 text-[length:var(--text-display-sm)] text-bone">
                  {combo.name}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-bone-dim">
                  {combo.summary}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="display text-[clamp(2rem,4vw,3rem)] text-bone">{combo.price}</p>
                  <p className="label mt-1 line-through">{combo.was}</p>
                </div>
                <ButtonLink href="#contact" size="lg">
                  Claim
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-faint">{pricingNote}</p>
      </div>
    </section>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const saved = savedPercent(plan);
  const preview = expanded ? plan.features : plan.features.slice(0, PREVIEW_COUNT);
  const hiddenCount = plan.features.length - PREVIEW_COUNT;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: EASE.outExpo }}
      className={cn(
        "group relative flex flex-col gap-7 bg-void p-7 transition-colors duration-500 hover:bg-elevate",
        plan.recommended && "bg-elevate",
      )}
    >
      {plan.recommended ? (
        <span
          className="absolute inset-x-0 top-0 h-px bg-signal-bright"
          aria-hidden
        />
      ) : null}

      <header>
        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[14rem] text-sm uppercase leading-snug tracking-[0.12em] text-bone">
            {plan.name}
          </h3>
          {plan.recommended ? (
            <span className="label shrink-0 !text-signal-bright">Recommended</span>
          ) : null}
        </div>

        <div className="mt-6 flex items-end gap-3">
          <span className="display text-[clamp(2.25rem,4vw,3.25rem)] text-bone">{plan.price}</span>
          {plan.period ? <span className="label pb-2">{plan.period}</span> : null}
        </div>

        {plan.was ? (
          <p className="mt-2 flex items-center gap-3">
            <span className="font-mono text-sm text-faint line-through">{plan.was}</span>
            {saved ? (
              <span className="rounded-full border border-signal/40 px-2 py-0.5 font-mono text-[0.625rem] text-signal-bright">
                −{saved}%
              </span>
            ) : null}
          </p>
        ) : null}
      </header>

      <ul className="flex flex-1 flex-col gap-2.5">
        {preview.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm leading-snug text-bone-dim">
            <span className="mt-[0.5rem] h-px w-2.5 shrink-0 bg-signal/70" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      {plan.notes.length ? (
        <ul className="flex flex-col gap-2 border-t border-line pt-4">
          {plan.notes.map((note) => (
            <li key={note} className="text-xs leading-relaxed text-faint">
              {note}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-4">
        {hiddenCount > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="label w-fit border-b border-line pb-1 transition-colors hover:!text-bone"
          >
            {expanded ? "Show less" : `+ ${hiddenCount} more included`}
          </button>
        ) : null}

        <ButtonLink href="#contact" variant="ghost" size="sm" className="w-fit">
          Start with this
        </ButtonLink>
      </div>
    </motion.article>
  );
}
