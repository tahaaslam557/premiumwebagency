"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { motion } from "motion/react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const CoreScene = dynamic(() => import("./CoreScene").then((mod) => mod.CoreScene), {
  ssr: false,
});

const STAGES = [
  { key: "data", label: "Data", caption: "Signals arrive unsorted." },
  { key: "intelligence", label: "Intelligence", caption: "Patterns resolve into meaning." },
  { key: "design", label: "Design", caption: "Meaning takes a form people can use." },
  { key: "product", label: "Product", caption: "Form is engineered into something that ships." },
  { key: "growth", label: "Growth", caption: "The system compounds after launch." },
];

/**
 * The signature interaction. One scroll sequence takes the core from scattered
 * noise to a connected lattice while the stage readout advances underneath it:
 * chaos → intelligence → system → growth.
 */
export function IntelligenceCore() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const node = root.current;
    const pinNode = pin.current;
    if (!node || !pinNode) return;

    const media = gsap.matchMedia();

    media.add({ animate: "(prefers-reduced-motion: no-preference)" }, (context) => {
      // With motion reduced there is no sequence to scrub: the core is simply
      // shown in its resolved state and the stage list reads as a list.
      if (!context.conditions?.animate) {
        setProgress(1);
        return;
      }

      ScrollTrigger.create({
        trigger: node,
        start: "top top",
        end: "+=340%",
        scrub: true,
        // An element, not a selector — see Manifesto for why.
        pin: pinNode,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Quantised so React re-renders ~50 times across the sequence, not 60/s.
          // The 3D layer damps between steps, so the motion still reads continuous.
          setProgress(Math.round(self.progress * 50) / 50);
        },
      });
    });

    return () => {
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const stageIndex = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));

  return (
    <section
      ref={root}
      id="engine"
      className="relative border-t border-line bg-void"
      aria-labelledby="engine-heading"
    >
      <div ref={pin} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <CoreScene progress={progress} />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 60% at 50% 50%, transparent 30%, color-mix(in oklab, var(--color-void) 55%, transparent) 72%, color-mix(in oklab, var(--color-void) 92%, transparent) 100%)",
          }}
          aria-hidden
        />

        <div className="page relative flex flex-1 flex-col justify-between py-16">
          <div className="flex items-start justify-between gap-8">
            <div>
              <span className="label !text-signal-bright">System / 04 — The Engine</span>
              <h2
                id="engine-heading"
                className="display mt-6 max-w-md text-[length:var(--text-display-sm)] text-bone"
              >
                Chaos becomes a system.
              </h2>
            </div>

            <div className="hidden text-right sm:block">
              <span className="label">Core coherence</span>
              <p className="mt-2 font-mono text-3xl tabular-nums text-bone">
                {Math.round(progress * 100).toString().padStart(3, "0")}%
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-md text-center">
            <motion.p
              key={STAGES[stageIndex].key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-balance text-lg leading-snug text-bone-dim"
            >
              {STAGES[stageIndex].caption}
            </motion.p>
          </div>

          <div>
            <div className="relative mb-6 h-px w-full bg-line">
              <span
                className="absolute inset-y-0 left-0 bg-signal-bright transition-[width] duration-200 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <ol className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {STAGES.map((stage, index) => {
                const reached = index <= stageIndex;
                return (
                  <li key={stage.key} className="flex flex-col gap-1.5">
                    <span
                      className={cn(
                        "label tabular-nums transition-colors duration-500",
                        reached ? "!text-signal-bright" : "!text-faint",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-sm uppercase tracking-[0.14em] transition-colors duration-500",
                        reached ? "text-bone" : "text-faint",
                      )}
                    >
                      {stage.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
