"use client";

import { motion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/lib/constants";
import { inView } from "@/lib/motion";

type MaskTextProps = {
  text: string;
  id?: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
};

/**
 * Line-by-line masked reveal.
 *
 * Lines are authored explicitly with `\n` rather than measured at runtime — no
 * layout thrash, no hydration mismatch, and the full string stays in the DOM
 * for screen readers and search engines.
 *
 * The viewport observer sits on the *wrapper*, never on the translated lines.
 * An IntersectionObserver clips against ancestor overflow, so a line parked at
 * `y: 115%` inside its `overflow-hidden` mask has an empty intersection rect
 * and would never report as visible — the heading would stay hidden forever.
 * Watching the in-flow wrapper and driving the lines through variants avoids
 * that entirely.
 */
export function MaskText({
  text,
  id,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  as: Tag = "div",
}: MaskTextProps) {
  const lines = text.split("\n");

  const line: Variants = {
    hidden: { y: "115%" },
    show: (index: number) => ({
      y: "0%",
      transition: { duration: 1.05, delay: delay + index * stagger, ease: EASE.outExpo },
    }),
  };

  return (
    <Tag id={id} className={cn("relative", className)}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>

      <motion.span
        aria-hidden="true"
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={inView}
      >
        {lines.map((content, index) => (
          // pb leaves room for descenders: the mask is a real clip, and with
          // display line-height below 1 a "g" or "y" would otherwise be cut.
          <span key={`${content}-${index}`} className="block overflow-hidden pb-[0.18em]">
            <motion.span
              data-reveal
              custom={index}
              variants={line}
              className={cn("block will-change-transform", lineClassName)}
            >
              {content}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
