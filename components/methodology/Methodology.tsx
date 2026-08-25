"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { EASE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { methodology } from "@/data/methodology";

/**
 * Where down the viewport a stage counts as "the one being read". Slightly
 * above centre, which is where the eye actually sits.
 */
const READING_LINE = 0.45;

/**
 * The operating model. A sticky readout on the left tracks whichever stage is
 * under the fold on the right — scroll-driven, but with every stage rendered in
 * the document so it reads fine with scripting reduced or motion disabled.
 */
export function Methodology() {
  const [active, setActive] = useState(0);
  const stageRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Five stages "run in order", so the readout has to move in order too, and
  // an IntersectionObserver cannot promise that. It reports only the entries
  // whose intersection *changed*, so the most central stage is often not in
  // the batch at all; and ranking what is there by `intersectionRatio` ranks
  // by *proportion of the element*, which a -40%/-40% band turns into a
  // measure of how short the element is rather than how central. Between them
  // the stage counter ran 1 -> 2 -> 1 -> 3, skipping one and going backwards
  // while the page scrolled forwards.
  //
  // A reading line answers the question directly: the active stage is the last
  // one whose top has crossed it. Tops are monotonic in document order, so
  // this steps 0->1->2->3->4 and back again and cannot skip or invert.
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const nodes = stageRefs.current.filter(Boolean) as HTMLLIElement[];
      if (!nodes.length) return;

      const line = window.innerHeight * READING_LINE;
      let next = 0;
      for (let index = 0; index < nodes.length; index += 1) {
        if (nodes[index].getBoundingClientRect().top > line) break;
        next = index;
      }
      setActive((previous) => (previous === next ? previous : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    // Lenis drives the page through native scroll, so this needs no special
    // case for it.
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const current = methodology[active];

  return (
    <section
      id="method"
      aria-labelledby="method-heading"
      className="relative border-t border-line bg-void py-28 lg:py-36"
    >
      <div className="page">
        <SectionHeader
          titleId="method-heading"
          index="08"
          eyebrow="Operating model"
          title={"How the\nsystem runs."}
          description="Five stages, run in order, on every engagement. The last one never ends."
        />

        <div className="mt-20 grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Sticky readout */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-tint/[0.04] to-transparent">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(80% 70% at 50% 20%, color-mix(in oklab, var(--color-signal) 20%, transparent) 0%, transparent 70%)",
                  }}
                  aria-hidden
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.index}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.5, ease: EASE.outExpo }}
                    className="absolute inset-0 flex flex-col justify-between p-8"
                  >
                    <span className="label !text-signal-bright">{current.signal}</span>
                    <span className="display text-[7rem] leading-none text-bone/10">
                      {current.index}
                    </span>
                    <div>
                      <p className="display text-[length:var(--text-display-sm)] text-bone">
                        {current.title}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {current.outputs.map((output) => (
                          <li
                            key={output}
                            className="rounded-full border border-line bg-void/60 px-3 py-1.5 text-xs text-mute"
                          >
                            {output}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex gap-1.5">
                {methodology.map((stage, index) => (
                  <span
                    key={stage.index}
                    className={cn(
                      "h-px flex-1 transition-colors duration-500",
                      index <= active ? "bg-signal-bright" : "bg-line",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stage list */}
          <ol className="border-t border-line">
            {methodology.map((stage, index) => (
              <li
                key={stage.index}
                data-index={index}
                ref={(node) => {
                  stageRefs.current[index] = node;
                }}
                className="group border-b border-line py-9 lg:py-12"
              >
                <div className="flex items-baseline gap-5">
                  <span
                    className={cn(
                      "label tabular-nums transition-colors duration-500",
                      index === active ? "!text-signal-bright" : "!text-faint",
                    )}
                  >
                    {stage.index}
                  </span>
                  <h3
                    className={cn(
                      "display text-[clamp(1.75rem,3.4vw,3rem)] transition-colors duration-500",
                      index === active ? "text-bone" : "text-faint",
                    )}
                  >
                    {stage.title}
                  </h3>
                </div>

                <p className="mt-5 max-w-xl leading-relaxed text-mute">{stage.body}</p>

                <ul className="mt-5 flex flex-wrap gap-2 lg:hidden">
                  {stage.outputs.map((output) => (
                    <li
                      key={output}
                      className="rounded-full border border-line bg-tint/[0.03] px-3 py-1.5 text-xs text-mute"
                    >
                      {output}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
