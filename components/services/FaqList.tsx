"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { EASE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Faq } from "@/data/service-pages";

/**
 * Standing questions, one open at a time. Every answer is in the DOM as text
 * whether or not its panel is open — collapsing is a height animation on a
 * rendered element, not a conditional render — so the content is still there
 * for search engines and for anyone reading with scripting off.
 */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="border-t border-line">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        return (
          <li key={faq.question} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                data-cursor="action"
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span
                  className={cn(
                    "text-[1.0625rem] leading-snug transition-colors duration-300",
                    isOpen ? "text-bone" : "text-bone-dim group-hover:text-bone",
                  )}
                >
                  {faq.question}
                </span>
                <span
                  className="relative mt-2 block h-3 w-3 shrink-0"
                  aria-hidden
                >
                  <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-signal-bright" />
                  <span
                    className={cn(
                      "absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-signal-bright transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isOpen ? "scale-y-0" : "scale-y-100",
                    )}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: EASE.outExpo }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-7 text-[0.9375rem] leading-relaxed text-mute">
                    {faq.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
