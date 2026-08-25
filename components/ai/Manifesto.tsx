"use client";

import { useRef } from "react";
import { motion, type Variants } from "motion/react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { manifesto } from "@/data/services";

const LINE_ONE = ["AI", "IS", "NOT", "A", "SERVICE."];
const LINE_TWO = ["IT'S", "HOW", "WE", "THINK."];

/**
 * The statement section: one pinned scroll sequence, scrubbed by GSAP.
 *
 * Each word of line one is two nested movers, and that nesting is load-bearing.
 * The entrance and the exit both animate `y`; pointed at the same element the
 * scrubbed timeline captures its start value at init — before the entrance has
 * run — and then stomps the word back off-screen on every scroll tick. So they
 * get an element each: Motion reveals the inner span on approach, GSAP scrubs
 * the outer one out. Different elements, different libraries, no overlap.
 *
 * The reveal is driven from the in-flow line wrapper rather than from the words
 * themselves: a word parked below its `overflow-hidden` mask has an empty
 * intersection rect, so an observer on the word would never fire.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const node = root.current;
    const pinNode = pin.current;
    if (!node || !pinNode) return;

    const media = gsap.matchMedia();

    media.add({ animate: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (!context.conditions?.animate) return;

      const exit = gsap.utils.toArray<HTMLElement>("[data-line='one'] [data-exit]", node);
      const two = gsap.utils.toArray<HTMLElement>("[data-line='two'] [data-exit]", node);
      const rows = gsap.utils.toArray<HTMLElement>("[data-statement]", node);
      const rail = node.querySelector("[data-rail]");

      gsap.set(two, { yPercent: 118 });
      gsap.set(rows, { opacity: 0, y: 26 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: "top top",
          end: "+=200%",
          scrub: 0.85,
          // An element, never a selector: `pin: "[data-pin]"` resolves against
          // the whole document, so a second pinned section would silently grab
          // the first one's element.
          pin: pinNode,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // Hold on the first statement before anything moves.
        .to({}, { duration: 0.55 })
        .to(exit, { yPercent: -118, stagger: 0.05, duration: 0.8, ease: "expo.in" })
        .to(two, { yPercent: 0, stagger: 0.08, duration: 1, ease: "expo.out" }, "<0.25")
        .to(rail, { scaleY: 1, duration: 1.4, ease: "none" }, "<")
        .to(rows, { opacity: 1, y: 0, stagger: 0.22, duration: 0.8, ease: "expo.out" }, "<0.15")
        .to({}, { duration: 0.5 });
    });

    return () => {
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={root}
      id="intelligence"
      className="relative bg-void"
      aria-labelledby="manifesto-heading"
    >
      <div ref={pin} className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 22% 40%, color-mix(in oklab, var(--color-signal) 13%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />

        <div className="page relative grid w-full gap-16 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <span className="label !text-signal-bright">System / 02 — Identity</span>

            <h2
              id="manifesto-heading"
              className="display mt-8 text-[length:var(--text-display-lg)] text-bone"
            >
              <span className="sr-only">AI is not a service. It&rsquo;s how we think.</span>

              <span aria-hidden="true" className="relative block">
                <motion.span
                  data-line="one"
                  className="block"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "0px 0px -25% 0px" }}
                >
                  {LINE_ONE.map((word, index) => (
                    <Word key={word} enterIndex={index}>
                      {word}
                    </Word>
                  ))}
                </motion.span>

                <span
                  data-line="two"
                  className="absolute inset-0 block motion-reduce:relative motion-reduce:mt-4"
                >
                  {LINE_TWO.map((word) => (
                    <Word key={word}>
                      <span className="text-gradient-bone">{word}</span>
                    </Word>
                  ))}
                </span>
              </span>
            </h2>
          </div>

          <div className="relative flex gap-8">
            <div className="relative w-px shrink-0 bg-line">
              <span
                data-rail
                className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-signal-bright motion-reduce:scale-y-100"
              />
            </div>

            <ul className="flex flex-col gap-7">
              {manifesto.map((statement, index) => (
                <li
                  key={statement}
                  data-statement
                  className="motion-reduce:!opacity-100 motion-reduce:!translate-y-0"
                >
                  <span className="label !text-faint">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-xl leading-snug tracking-[-0.02em] text-bone-dim sm:text-2xl">
                    {statement}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const enterVariants: Variants = {
  hidden: { y: "118%" },
  show: (index: number) => ({
    y: "0%",
    transition: { duration: 1, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * A masked word. Passing `enterIndex` adds the inner mover that Motion reveals;
 * without it the word has only the outer mover that GSAP scrubs.
 */
function Word({
  children,
  enterIndex,
}: {
  children: React.ReactNode;
  enterIndex?: number;
}) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] pr-[0.22em] align-bottom">
      <span data-exit className="inline-block will-change-transform">
        {enterIndex === undefined ? (
          children
        ) : (
          <motion.span
            data-enter
            data-reveal
            custom={enterIndex}
            variants={enterVariants}
            className="inline-block will-change-transform"
          >
            {children}
          </motion.span>
        )}
      </span>
    </span>
  );
}
