"use client";

import { motion } from "motion/react";

import { EASE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const READOUT = [
  { key: "SYSTEM", value: "ONLINE" },
  { key: "INTELLIGENCE", value: "ACTIVE" },
  { key: "CREATIVE ENGINE", value: "RUNNING" },
];

/** Small live-status readout. Decorative microcopy, not a fake dashboard. */
export function SystemStatus({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <dl className={cn("flex shrink-0 flex-col gap-2 whitespace-nowrap", className)}>
      {READOUT.map((row, index) => (
        <motion.div
          data-reveal
          key={row.key}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: delay + index * 0.1, ease: EASE.outExpo }}
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-bright" />
          </span>
          <dt className="label !text-faint">{row.key}</dt>
          <dd className="label !text-bone-dim">{row.value}</dd>
        </motion.div>
      ))}
    </dl>
  );
}
