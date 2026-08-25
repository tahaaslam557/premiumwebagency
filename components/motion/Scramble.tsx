"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\|<>#*+";

/**
 * Small-dose text scramble for system microcopy. Used sparingly — never on
 * anything a visitor needs to read to understand the page.
 */
export function Scramble({
  text,
  className,
  speed = 34,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const [output, setOutput] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return;
    }
    let step = 0;
    timer.current = setInterval(() => {
      step += 1;
      setOutput(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < step / 2) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (step / 2 > text.length && timer.current) {
        clearInterval(timer.current);
        setOutput(text);
      }
    }, speed);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [text, speed, reduced]);

  return (
    <span className={className} suppressHydrationWarning>
      {output}
    </span>
  );
}
