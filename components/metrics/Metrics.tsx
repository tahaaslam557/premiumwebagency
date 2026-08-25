"use client";

import { motion } from "motion/react";

import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { EASE } from "@/lib/constants";
import { inView } from "@/lib/motion";
import { metrics } from "@/data/metrics";
import { reputation } from "@/data/site";

/**
 * Proof, as a data readout. Figures are the ones the company publishes —
 * animated on entry, but never invented and never rounded up.
 */
export function Metrics() {
  return (
    <section
      id="proof"
      className="relative border-t border-line bg-void py-24 lg:py-32"
      aria-labelledby="proof-heading"
    >
      <div className="page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <span className="label !text-signal-bright">
              <span className="tabular-nums">06</span>
              <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
              Recorded output
            </span>
            <h2 id="proof-heading" className="sr-only">
              Recorded output
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="font-mono text-xs text-mute">
              {reputation.rating}/{reputation.ratingScale} rating ·{" "}
              {reputation.customersServed}+ customers served
            </p>
          </Reveal>
        </div>

        <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="group relative flex flex-col justify-between gap-10 bg-void p-7 transition-colors duration-500 hover:bg-elevate lg:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.7, delay: index * 0.08, ease: EASE.outExpo }}
            >
              <span className="label !text-faint tabular-nums">{metric.index}</span>

              <div>
                <dd className="display flex items-baseline text-[clamp(2.75rem,5.5vw,4.75rem)] text-bone">
                  <Counter value={metric.value} duration={1800 + index * 220} />
                  <span className="text-signal-bright">{metric.suffix}</span>
                </dd>
                <dt className="mt-4 text-sm uppercase tracking-[0.14em] text-bone-dim">
                  {metric.label}
                </dt>
                <p className="mt-3 text-sm leading-relaxed text-faint">{metric.caption}</p>
              </div>

              <span
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal-bright transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                aria-hidden
              />
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
