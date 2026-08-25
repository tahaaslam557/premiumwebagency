"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Tracing Beam — after Aceternity UI (`tracing-beam`, MIT).
 * https://ui.aceternity.com/components/tracing-beam
 *
 * A line down the left of a block of content, filled in as it is scrolled
 * through. Upstream's mechanism is kept: measure the content, draw one SVG
 * path that tall, and drive a gradient stroke along it from `scrollYProgress`
 * through a spring.
 *
 * Three changes. The stroke is painted from the accent tokens instead of the
 * hard-coded emerald/indigo pair, so it themes with everything else. The
 * height is re-measured on resize — upstream measures once on mount, which
 * leaves the beam the wrong length for the rest of the session as soon as the
 * copy reflows. And with reduced motion the beam is simply drawn complete:
 * the line is structure, so it stays; only the tracing stops.
 */
export function TracingBeam({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [height, setHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 60%"],
  });

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const measure = () => setHeight(node.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const spring = { stiffness: 420, damping: 90 };
  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.85], [0, height]), spring);
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, height]), spring);

  return (
    <motion.div ref={ref} className={cn("relative w-full", className)}>
      {/* The rail sits outside the reading column on wide screens and tucks
          against it below lg, where there is no room to spare. */}
      <div className="absolute left-0 top-0 hidden h-full w-5 sm:block" aria-hidden>
        <svg
          viewBox={`0 0 20 ${height}`}
          width="20"
          height={height}
          className="block"
          aria-hidden="true"
        >
          <path
            d={`M 1 0 V ${height}`}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="1.25"
          />
          <motion.path
            d={`M 1 0 V ${height}`}
            fill="none"
            stroke="url(#beam-gradient)"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <defs>
            <motion.linearGradient
              id="beam-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={reduced ? 0 : y1}
              y2={reduced ? height : y2}
            >
              <stop stopColor="var(--color-signal)" stopOpacity="0" />
              <stop offset="0.12" stopColor="var(--color-signal)" />
              <stop offset="0.72" stopColor="var(--color-signal-bright)" />
              <stop offset="1" stopColor="var(--color-signal-bright)" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>

      <div ref={contentRef} className="sm:pl-12 lg:pl-16">
        {children}
      </div>
    </motion.div>
  );
}
