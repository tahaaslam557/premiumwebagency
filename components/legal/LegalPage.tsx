import type { ReactNode } from "react";

import { Footer } from "@/components/footer/Footer";
import { MaskText } from "@/components/motion/MaskText";
import { Navbar } from "@/components/navigation/Navbar";
import { Reveal } from "@/components/motion/Reveal";
import { legalLinks } from "@/data/navigation";

type LegalPageProps = {
  /** Two-digit marker, matching the homepage's section indices. */
  index: string;
  eyebrow: string;
  /** Newline-separated: each line is masked and revealed on its own. */
  title: string;
  intro?: ReactNode;
  updated?: string;
  children: ReactNode;
  /** The route this page occupies, so it can drop itself from the index. */
  current: string;
};

/**
 * Shell for the four document routes. It borrows the homepage's chrome
 * wholesale — same header, same footer, same grid, same opener — because these
 * pages are not a different place, only a quieter part of the same one. There
 * is no new visual language here on purpose.
 */
export function LegalPage({
  index,
  eyebrow,
  title,
  intro,
  updated,
  children,
  current,
}: LegalPageProps) {
  const others = legalLinks.filter((link) => link.href !== current);

  return (
    <>
      <Navbar />

      <main id="main">
        <section className="relative overflow-hidden border-b border-line bg-void pt-[var(--nav-h)]">
          <div
            className="grid-field pointer-events-none absolute inset-0 opacity-[0.45]"
            aria-hidden
          />
          {/* Same falloff the hero uses, so the grid dies out under the type
              rather than stopping at an edge. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 100%, color-mix(in oklab, var(--color-void) 92%, transparent) 0%, color-mix(in oklab, var(--color-void) 45%, transparent) 52%, transparent 82%)",
            }}
            aria-hidden
          />

          <header className="page relative z-10 py-20 lg:py-28">
            <Reveal className="flex items-center gap-4">
              <span className="label !text-signal-bright">
                <span className="tabular-nums">{index}</span>
                <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                <span>{eyebrow}</span>
              </span>
            </Reveal>

            <MaskText
              as="h1"
              text={title}
              className="display mt-7 text-[length:var(--text-display-md)] text-bone"
            />

            {intro ? (
              <Reveal
                delay={0.12}
                className="mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-mute"
              >
                {intro}
              </Reveal>
            ) : null}

            {updated ? (
              <Reveal delay={0.18} className="mt-8">
                <span className="label !text-[0.625rem]">Last updated / {updated}</span>
              </Reveal>
            ) : null}
          </header>
        </section>

        <section className="page py-16 lg:py-24">
          <Reveal>{children}</Reveal>

          <div className="rule mt-20" />

          <nav aria-label="Other documents" className="mt-10">
            <h2 className="label !text-bone">Also on file</h2>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {others.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-mute transition-colors hover:text-bone"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>

      <Footer />
    </>
  );
}
