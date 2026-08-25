"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { markBootReady } from "@/lib/boot";
import { PRELOADER_KEY, PRELOADER_MAX_MS } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/hooks";

const BOOT_LINES = [
  "MOUNTING CREATIVE ENGINE",
  "LOADING DESIGN SYSTEM",
  "CALIBRATING INTELLIGENCE CORE",
  "SYSTEM ONLINE",
];

/**
 * Boot screen. It is allowed exactly one job — cover the first paint while the
 * hero composes itself — and exactly one budget: PRELOADER_MAX_MS. It shows
 * once per session, never on reduced-motion, and cannot trap the page: a
 * hard timeout dismisses it even if something upstream stalls.
 */
export function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const booted = sessionStorage.getItem(PRELOADER_KEY) === "1";
    if (booted || reduced) {
      markBootReady();
      return;
    }

    setActive(true);
    document.documentElement.style.overflow = "hidden";

    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / PRELOADER_MAX_MS);
      setProgress(t);
      setLine(Math.min(BOOT_LINES.length - 1, Math.floor(t * BOOT_LINES.length)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const finish = () => {
      sessionStorage.setItem(PRELOADER_KEY, "1");
      document.documentElement.style.overflow = "";
      setActive(false);
      markBootReady();
    };

    const timeout = window.setTimeout(finish, PRELOADER_MAX_MS);
    // Escape hatch: the boot screen is skippable, always.
    const onSkip = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") finish();
    };
    window.addEventListener("keydown", onSkip);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onSkip);
      document.documentElement.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[150] flex flex-col justify-between bg-void px-[var(--gutter)] py-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="flex items-baseline justify-between">
            <span className="label !text-bone">PWA</span>
            <span className="label tabular-nums">{Math.round(progress * 100)}%</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <span className="label !text-signal-bright">SYSTEM INITIALIZING</span>
            <div className="h-px w-[min(28rem,72vw)] overflow-hidden bg-line">
              <motion.div
                className="h-full bg-signal-bright"
                style={{ scaleX: progress, transformOrigin: "left" }}
              />
            </div>
            <span className="label h-4 !text-mute">{BOOT_LINES[line]}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="label">CREATIVE ENGINE</span>
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem(PRELOADER_KEY, "1");
                document.documentElement.style.overflow = "";
                setActive(false);
                markBootReady();
              }}
              className="label transition-colors hover:!text-bone"
            >
              Skip
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
