import type { Variants } from "motion/react";
import { DURATION, EASE } from "./constants";

/**
 * Shared Motion variants. Component-level transitions live here;
 * scroll-pinned storytelling belongs to GSAP so the two never overlap.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.outExpo },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE.outQuart } },
};

export const maskUp: Variants = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: DURATION.reveal, ease: EASE.outExpo },
  },
};

export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE.outExpo },
  },
};

/** Default viewport config: fire once, slightly before the element lands. */
export const inView = { once: true, margin: "0px 0px -12% 0px" } as const;
