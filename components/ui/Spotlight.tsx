"use client";

import { useRef, type ReactNode } from "react";

import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Spotlight — after Aceternity UI's Card Spotlight.
 * https://ui.aceternity.com/components/card-spotlight
 *
 * A soft radial light that follows the pointer across the card. Upstream keeps
 * the position in React state, which re-renders the card on every mousemove;
 * this writes two custom properties straight onto the node inside a rAF
 * instead, so the effect costs one style write per frame and no renders at all.
 *
 * Nothing here is load-bearing: coarse pointers and reduced-motion users get
 * the card with no light on it, which is the same card.
 */
export function Spotlight({
  children,
  className,
  /** How far the light reaches, in pixels. */
  radius = 320,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const fine = useHasFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || frame.current) return;
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--spot-x", `${clientX - rect.left}px`);
      node.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={cn("group/spot relative overflow-hidden", className)}
      style={{ ["--spot-r" as string]: `${radius}px` }}
    >
      {enabled ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
          style={{
            background:
              "radial-gradient(var(--spot-r) circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--color-signal) 16%, transparent), transparent 72%)",
          }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
