"use client";

import { usePrefersReducedMotion } from "@/lib/hooks";

/** Fixed film-grain layer. Purely decorative, never interactive. */
export function Grain() {
  const reduced = usePrefersReducedMotion();
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={reduced ? { animation: "none", opacity: 0.02 } : undefined}
    />
  );
}
