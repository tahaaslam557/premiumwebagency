"use client";

import { useEffect, useRef, useState } from "react";

import { useInViewOnce, usePrefersReducedMotion } from "@/lib/hooks";
import { formatCount } from "@/lib/utils";

type CounterProps = {
  value: number;
  duration?: number;
  className?: string;
};

/**
 * Counts to `value` once on entry. Reduced-motion users get the final figure
 * immediately — the number is the content, the animation is not.
 */
export function Counter({ value, duration = 2000, className }: CounterProps) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>("0px 0px -20% 0px");
  const reduced = usePrefersReducedMotion();
  const [current, setCurrent] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!seen) return;
    if (reduced) {
      setCurrent(value);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Expo-out: fast commit, long settle — reads as a system resolving.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCurrent(Math.round(value * eased));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [seen, reduced, value, duration]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {formatCount(seen ? current : 0)}
    </span>
  );
}
