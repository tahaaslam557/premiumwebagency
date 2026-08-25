"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { EASE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { capabilities } from "@/data/services";

/**
 * The service list, rebuilt as a stack you interrogate rather than scroll past.
 * Desktop drives a single detail panel from an eight-row index; below `lg` the
 * same data becomes a disclosure list, because hover is not available there.
 */
export function CapabilityStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = capabilities[activeIndex];

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative border-t border-line bg-void py-28 lg:py-40"
    >
      <div className="page">
        <SectionHeader
          titleId="capabilities-heading"
          index="03"
          eyebrow="Intelligence Stack"
          title={"Eight layers.\nOne system."}
          description="Every discipline Premium Web Agency runs, organised the way we actually build: strategy first, intelligence throughout, growth as an engineering problem."
        />

        {/* Desktop: index + detail panel */}
        <div className="mt-20 hidden gap-14 lg:grid lg:grid-cols-[1fr_1.05fr]">
          <ul className="border-t border-line">
            {capabilities.map((capability, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={capability.key} className="border-b border-line">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    aria-pressed={isActive}
                    data-cursor="explore"
                    data-cursor-label="OPEN"
                    className="group relative flex w-full items-baseline gap-6 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "label tabular-nums transition-colors duration-300",
                        isActive ? "!text-signal-bright" : "!text-faint",
                      )}
                    >
                      {capability.index}
                    </span>
                    <span
                      className={cn(
                        "display text-[clamp(1.75rem,3.2vw,3rem)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isActive
                          ? "translate-x-2 text-bone"
                          : "text-faint group-hover:translate-x-1 group-hover:text-bone-dim",
                      )}
                    >
                      {capability.title}
                    </span>

                    {isActive ? (
                      <motion.span
                        layoutId="capability-marker"
                        className="absolute inset-y-0 -left-4 w-px bg-signal-bright"
                        transition={{ duration: 0.45, ease: EASE.outExpo }}
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="relative min-h-[30rem] rounded-2xl border border-line bg-gradient-to-b from-tint/[0.035] to-transparent p-10">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(90% 60% at 85% 0%, color-mix(in oklab, var(--color-signal) 16%, transparent) 0%, transparent 65%)",
              }}
              aria-hidden
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE.outExpo }}
                className="relative"
              >
                <div className="flex items-center justify-between">
                  <span className="label !text-signal-bright">
                    Layer {active.index} / {active.title}
                  </span>
                  <span className="label">{active.services.length} services</span>
                </div>

                <p className="display mt-8 text-[clamp(1.5rem,2.3vw,2.25rem)] text-bone">
                  {active.statement}
                </p>

                <p className="mt-6 max-w-lg leading-relaxed text-mute">{active.body}</p>

                <div className="rule my-9" />

                <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {active.services.map((service, index) => (
                    <motion.li
                      key={service}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.06 + index * 0.028, ease: EASE.outExpo }}
                      className="flex items-start gap-2.5 text-sm text-bone-dim"
                    >
                      <span className="mt-[0.45rem] h-px w-3 shrink-0 bg-signal/70" />
                      {service}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Below lg: disclosure list — no hover dependency, no hidden content. */}
        <div className="mt-16 lg:hidden">
          <MobileStack />
        </div>
      </div>
    </section>
  );
}

function MobileStack() {
  const [open, setOpen] = useState<string | null>(capabilities[0].key);

  return (
    <ul className="border-t border-line">
      {capabilities.map((capability) => {
        const isOpen = open === capability.key;
        return (
          <li key={capability.key} className="border-b border-line">
            <Reveal>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : capability.key)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="flex items-baseline gap-4">
                  <span
                    className={cn(
                      "label tabular-nums",
                      isOpen ? "!text-signal-bright" : "!text-faint",
                    )}
                  >
                    {capability.index}
                  </span>
                  <span className="display text-[length:var(--text-display-sm)] text-bone">
                    {capability.title}
                  </span>
                </span>
                <span
                  className={cn(
                    "relative h-3 w-3 shrink-0 transition-transform duration-400",
                    isOpen && "rotate-45",
                  )}
                  aria-hidden
                >
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-bone-dim" />
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-bone-dim" />
                </span>
              </button>
            </Reveal>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE.outExpo }}
                  className="overflow-hidden"
                >
                  <div className="pb-7">
                    <p className="text-lg tracking-[-0.02em] text-bone">{capability.statement}</p>
                    <p className="mt-3 text-sm leading-relaxed text-mute">{capability.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {capability.services.map((service) => (
                        <li
                          key={service}
                          className="rounded-full border border-line bg-tint/[0.03] px-3 py-1.5 text-xs text-bone-dim"
                        >
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
