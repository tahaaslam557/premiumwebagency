"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { ButtonLink } from "@/components/ui/Button";
import { Scramble } from "@/components/motion/Scramble";
import { HeroGrid } from "./HeroGrid";
import { SystemStatus } from "./SystemStatus";
import { onBootReady } from "@/lib/boot";
import { EASE } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { offer, reputation } from "@/data/site";
import { workSummary } from "@/data/portfolio";

// The 3D layer never blocks first paint and never ships to the server bundle.
const HeroScene = dynamic(
  () => import("./HeroScene").then((mod) => mod.HeroScene),
  { ssr: false },
);

const HEADLINE = ["WE", "ARE", "AI."];

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [sceneMounted, setSceneMounted] = useState(false);

  useEffect(() => {
    // Fires synchronously when boot already finished (repeat visit, reduced
    // motion), so the hero never waits on a timer it doesn't need.
    const unsubscribe = onBootReady(() => setReady(true));
    // Safety net: if the preloader errors out, the hero still resolves.
    const fallback = window.setTimeout(() => setReady(true), 2400);
    return () => {
      unsubscribe();
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => setSceneMounted(true), reduced ? 0 : 120);
    return () => window.clearTimeout(timer);
  }, [ready, reduced]);

  const base = ready ? 0 : 0.25;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void pt-[var(--nav-h)]"
    >
      {/* Depth stack: grid field, 3D core, radial falloff, content. */}
      <HeroGrid />

      <div className="pointer-events-none absolute inset-0 lg:left-[38%]">
        {sceneMounted ? (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: EASE.outExpo }}
          >
            <HeroScene />
          </motion.div>
        ) : null}
      </div>

      {/* Legibility scrim. Heavier below `lg`, where the copy sits directly
          over the core instead of beside it. */}
      <div
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--color-void) 35%, transparent) 0%, color-mix(in oklab, var(--color-void) 72%, transparent) 34%, color-mix(in oklab, var(--color-void) 94%, transparent) 58%, var(--color-void) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, color-mix(in oklab, var(--color-void) 92%, transparent) 0%, color-mix(in oklab, var(--color-void) 40%, transparent) 45%, transparent 78%)",
        }}
        aria-hidden
      />

      <div className="page relative z-10 flex flex-1 flex-col justify-center py-10 sm:py-14 lg:py-24">
        <motion.div
          data-reveal
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.7, delay: base, ease: EASE.outQuart }}
        >
          <span className="label !text-signal-bright">
            <Scramble text="SYSTEM / 01" />
          </span>
          <span className="hidden h-px w-12 bg-line sm:block" />
          <span className="label hidden sm:inline">AI-Native Creative Technology</span>
        </motion.div>

        <h1 className="display mt-6 text-[length:var(--text-display-xl)] text-bone sm:mt-10">
          <span className="sr-only">We are AI.</span>
          <span aria-hidden="true" className="block">
            {HEADLINE.map((word, index) => (
              <span key={word} className="block overflow-hidden pb-[0.1em] sm:inline-block sm:pr-[0.22em]">
                <motion.span
                  data-reveal
                  className="block will-change-transform"
                  initial={{ y: "112%" }}
                  animate={{ y: ready ? "0%" : "112%" }}
                  transition={{
                    duration: 1.15,
                    delay: base + 0.1 + index * 0.09,
                    ease: EASE.outExpo,
                  }}
                >
                  {index === HEADLINE.length - 1 ? (
                    <span className="text-gradient-bone">{word}</span>
                  ) : (
                    word
                  )}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          data-reveal
          className="mt-7 max-w-xl text-balance text-[1.0625rem] leading-relaxed text-bone-dim sm:mt-10 sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
          transition={{ duration: 0.9, delay: base + 0.45, ease: EASE.outExpo }}
        >
          We design, build and scale digital experiences where intelligence isn&rsquo;t an
          add-on — it&rsquo;s the operating system.
        </motion.p>

        <motion.div
          data-reveal
          className="mt-8 flex flex-wrap items-center gap-3 sm:mt-11"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
          transition={{ duration: 0.9, delay: base + 0.58, ease: EASE.outExpo }}
        >
          <ButtonLink href="#contact" size="lg">
            Build with us
          </ButtonLink>
          <ButtonLink href="#work" variant="line" size="lg">
            Explore our work
          </ButtonLink>
        </motion.div>
      </div>

      {/* Instrument rail: status, proof, scroll cue. */}
      <div className="relative z-10 border-t border-line/70">
        <div className="page flex flex-col gap-6 py-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <SystemStatus delay={base + 0.7} />

          <motion.div
            data-reveal
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.9, delay: base + 0.85 }}
          >
            <Stat value={`${reputation.rating}/${reputation.ratingScale}`} label="Client rating" />
            <Stat value={`${reputation.customersServed}+`} label="Customers served" />
            <Stat value={`${workSummary.sectors}`} label="Sectors shipped" />
            {offer.active ? (
              <Stat value={offer.headline} label="Current offer" accent />
            ) : null}
          </motion.div>

          <motion.a
            data-reveal
            href="#intelligence"
            data-cursor="explore"
            data-cursor-label="SCROLL"
            className="group hidden items-center gap-3 lg:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.9, delay: base + 0.95 }}
          >
            <span className="label transition-colors group-hover:!text-bone">Scroll</span>
            <span className="relative h-8 w-px overflow-hidden bg-line">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-signal-bright"
                animate={reduced ? undefined : { y: [-12, 32] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`font-mono text-sm tabular-nums ${accent ? "text-signal-bright" : "text-bone"}`}
      >
        {value}
      </span>
      <span className="label !text-[0.625rem]">{label}</span>
    </div>
  );
}
