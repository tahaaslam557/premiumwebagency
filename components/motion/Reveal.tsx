"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

import { inView } from "@/lib/motion";
import { DURATION, EASE } from "@/lib/constants";

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
};

/** Generic in-view fade/rise. One responsibility, used everywhere. */
export function Reveal({
  children,
  delay = 0,
  distance = 22,
  duration = DURATION.base,
  ...props
}: RevealProps) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration, delay, ease: EASE.outExpo }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
