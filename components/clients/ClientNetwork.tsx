"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "motion/react";

import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EASE } from "@/lib/constants";
import { inView } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { recognition, sectors, stack, testimonials } from "@/data/clients";

const VIEW = { w: 1320, h: 340 };
const ROWS = [112, 236];

/**
 * The client network. The source publishes work by industry rather than by
 * named client, so the constellation maps sectors — node size follows the
 * number of published projects in each, which is a fact we actually hold.
 */
export function ClientNetwork() {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = useMemo(() => {
    const maxWeight = Math.max(...sectors.map((sector) => sector.weight));

    // Evenly spaced across the full width, alternating between two rows.
    // A single band would collide labels as long as "CONSTRUCTION" outright,
    // and a random scatter would also differ between server and client — so
    // the layout is a deterministic zig-zag: x-neighbours always sit on
    // opposite rows, and same-row neighbours are two steps apart.
    const step = (VIEW.w - 240) / (sectors.length - 1);

    return sectors.map((sector, index) => ({
      ...sector,
      x: 120 + index * step,
      y: ROWS[index % ROWS.length],
      r: 7 + (sector.weight / maxWeight) * 15,
    }));
  }, []);

  const edges = useMemo(() => {
    // Chain the sequence, then tie each node to its row neighbour — enough
    // structure to read as a network without turning into a scribble.
    const pairs: Array<[number, number]> = [];
    for (let i = 0; i < nodes.length - 1; i += 1) pairs.push([i, i + 1]);
    for (let i = 0; i < nodes.length - 2; i += 1) pairs.push([i, i + 2]);
    return pairs;
  }, [nodes]);

  return (
    <section
      id="network"
      className="relative border-t border-line bg-void py-28 lg:py-36"
      aria-labelledby="network-heading"
    >
      <div className="page">
        <SectionHeader
          titleId="network-heading"
          index="07"
          eyebrow="Global client network"
          title={"Built across\neight sectors."}
          description="Ecommerce, fitness, food, transport, technology, real estate, fintech and construction — each node sized by the volume of published work behind it."
        />

        <Reveal className="relative mt-16">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-tint/[0.03] to-transparent">
            <svg
              viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
              className="h-auto w-full"
              role="img"
              aria-label={`Sector network: ${sectors.map((s) => s.label).join(", ")}`}
            >
              <defs>
                {/* `stop-color` is a presentation attribute, and presentation
                    attributes do not resolve custom properties — these have to
                    go through `style` to pick up the theme. */}
                <radialGradient id="node-glow">
                  <stop
                    offset="0%"
                    style={{ stopColor: "var(--color-signal-bright)" }}
                    stopOpacity="0.9"
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "var(--color-signal)" }}
                    stopOpacity="0"
                  />
                </radialGradient>
              </defs>

              {edges.map(([a, b], index) => {
                const from = nodes[a];
                const to = nodes[b];
                const lit = hovered === from.code || hovered === to.code;
                return (
                  <motion.line
                    key={`${from.code}-${to.code}-${index}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    style={{
                      stroke: lit
                        ? "var(--color-signal-bright)"
                        : "color-mix(in oklab, var(--color-bone) 18%, transparent)",
                    }}
                    strokeWidth={lit ? 1.1 : 0.7}
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={inView}
                    transition={{ duration: 1.1, delay: 0.1 + index * 0.02, ease: EASE.outExpo }}
                  />
                );
              })}

              {nodes.map((node, index) => {
                const active = hovered === node.code;
                return (
                  <motion.g
                    key={node.code}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={inView}
                    transition={{ duration: 0.6, delay: 0.35 + index * 0.05, ease: EASE.outExpo }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    onMouseEnter={() => setHovered(node.code)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r * 3}
                      fill="url(#node-glow)"
                      opacity={active ? 0.55 : 0.16}
                      className="transition-opacity duration-500"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={active ? node.r * 1.28 : node.r}
                      // Mixed against the page rather than stated outright, so
                      // an inactive node is always the same *step* off the
                      // background in either environment.
                      style={{
                        fill: active
                          ? "var(--color-signal-bright)"
                          : "color-mix(in oklab, var(--color-signal) 16%, var(--color-void))",
                        stroke: active
                          ? "var(--color-bone)"
                          : "color-mix(in oklab, var(--color-signal) 38%, var(--color-void))",
                      }}
                      strokeWidth={1}
                      className="transition-all duration-500"
                    />
                    <text
                      x={node.x}
                      y={node.y + node.r + 20}
                      textAnchor="middle"
                      className="fill-current font-mono text-[11px] uppercase tracking-[0.16em]"
                      style={{ fill: active ? "var(--color-bone)" : "var(--color-mute)" }}
                    >
                      {node.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Reveal>
              <span className="label">Recognition</span>
            </Reveal>
            <ul className="mt-6 flex flex-col">
              {recognition.map((item, index) => (
                <Reveal key={item.label} delay={index * 0.06}>
                  <li className="flex items-baseline justify-between border-b border-line py-4">
                    <span className="text-lg tracking-[-0.02em] text-bone">{item.label}</span>
                    <span className="label">{item.note}</span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.14} className="mt-10">
              <span className="label">Platforms we build on</span>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                {stack.map((logo) => (
                  <span key={logo.src} className="contents">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      title={logo.name}
                      width={346}
                      height={155}
                      loading="lazy"
                      className="on-dark h-7 w-auto opacity-55 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                    />
                    <Image
                      src={logo.lightSrc}
                      alt={logo.alt}
                      title={logo.name}
                      width={346}
                      height={155}
                      loading="lazy"
                      className="on-light h-7 w-auto opacity-55 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                    />
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <span className="label">Client feedback</span>
            </Reveal>
            <ul className="mt-6 grid gap-px bg-line sm:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <motion.li
                  key={testimonial.author}
                  className={cn(
                    "flex flex-col justify-between gap-6 bg-void p-6 transition-colors duration-500 hover:bg-elevate",
                  )}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ duration: 0.6, delay: index * 0.07, ease: EASE.outExpo }}
                >
                  <blockquote className="text-sm leading-relaxed text-bone-dim">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <footer>
                    <p className="text-sm text-bone">{testimonial.author}</p>
                    <p className="label mt-1">{testimonial.role}</p>
                  </footer>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
