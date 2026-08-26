import type { ReactNode } from "react";

import { HeroGrid } from "@/components/hero/HeroGrid";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { Scramble } from "@/components/motion/Scramble";

export type PageHeroStat = { title: string; body: string };

type PageHeroProps = {
  /** Two-digit marker, matching the homepage's section indices. */
  index?: string;
  eyebrow: string;
  /** Newline-separated: each line is masked and revealed on its own. */
  title: string;
  intro?: ReactNode;
  /** Buttons, usually. Rendered under the intro. */
  actions?: ReactNode;
  /** The instrument rail across the foot of the opener. */
  stats?: PageHeroStat[];
};

/**
 * The opener every top-level route shares — services, pricing, contact.
 *
 * It is the service template's opener, lifted so the three new routes cannot
 * drift from it: same interactive grid, same falloff under the type, same
 * scrambled eyebrow and masked heading, same rail across the foot. These pages
 * are deeper parts of the same site, not separate microsites, and the opener
 * is where that is either established or lost.
 */
export function PageHero({ index, eyebrow, title, intro, actions, stats }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[72svh] flex-col overflow-hidden border-b border-line bg-void pt-[var(--nav-h)]">
      <HeroGrid />

      {/* Kills the grid out under the type rather than letting it stop at an
          edge — the same falloff the homepage hero uses. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 85% at 50% 100%, color-mix(in oklab, var(--color-void) 92%, transparent) 0%, color-mix(in oklab, var(--color-void) 45%, transparent) 52%, transparent 82%)",
        }}
        aria-hidden
      />

      <div className="page relative z-10 flex flex-1 flex-col justify-center py-20 lg:py-28">
        <Reveal className="flex flex-wrap items-center gap-4">
          <span className="label !text-signal-bright">
            {index ? (
              <>
                <span className="tabular-nums">{index}</span>
                <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
              </>
            ) : null}
            <Scramble text={eyebrow.toUpperCase()} />
          </span>
        </Reveal>

        <MaskText
          as="h1"
          text={title}
          className="display mt-7 text-[length:var(--text-display-md)] text-bone sm:mt-9"
        />

        {intro ? (
          <Reveal
            delay={0.12}
            className="mt-8 max-w-2xl text-[1.0625rem] leading-relaxed text-bone-dim"
          >
            {intro}
          </Reveal>
        ) : null}

        {actions ? (
          <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-3">
            {actions}
          </Reveal>
        ) : null}
      </div>

      {stats?.length ? (
        <div className="relative z-10 border-t border-line/70">
          {/* A grid, not a wrapping flex row: the bodies are different lengths,
              and flex-wrap puts the last on a line of its own at most widths. */}
          <div className="page grid gap-6 py-6 sm:grid-cols-3 sm:gap-10">
            {stats.map((stat) => (
              <Reveal key={stat.title} className="flex flex-col gap-1.5">
                <span className="font-mono text-sm text-bone">{stat.title}</span>
                <span className="text-xs leading-relaxed text-mute">{stat.body}</span>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
