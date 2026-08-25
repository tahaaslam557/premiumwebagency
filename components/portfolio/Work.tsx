"use client";

import { useRef } from "react";

import { WorkCard } from "./WorkCard";
import { Reveal } from "@/components/motion/Reveal";
import { MaskText } from "@/components/motion/MaskText";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";
import { work, workSummary } from "@/data/portfolio";

/**
 * Output. One DOM tree serves both layouts — panels stack and scroll normally
 * by default, and `gsap.matchMedia` turns that same column into a pinned
 * horizontal track at `lg` and above. Rendering a single tree keeps the server
 * HTML honest and avoids a layout swap after hydration.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const node = root.current;
    const trackNode = track.current;
    if (!node || !trackNode) return;

    const media = gsap.matchMedia();

    media.add(
      { horizontal: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)" },
      (context) => {
        if (!context.conditions?.horizontal) return;

        const distance = () => trackNode.scrollWidth - window.innerWidth + 96;

        gsap.to(trackNode, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: node,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      },
    );

    return () => {
      media.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={root}
      id="work"
      // At lg the section becomes a fixed-height column: header on top, the
      // horizontal track taking whatever is left. Without that the pinned
      // section is taller than the viewport and the cards get cut off.
      // `--track-reserve` is everything the pinned track spends on something
      // other than a card: this section's header, the panel's own header, the
      // service tags and the gaps between them. The cards read it to work out
      // how tall they are allowed to be. One number, one threshold — the
      // header tightens and the cards shrink at the same moment, so the two
      // can never disagree and collide.
      className="relative border-t border-line bg-void [--track-reserve:30rem] lg:flex lg:h-[100svh] lg:flex-col lg:overflow-hidden [@media(max-height:900px)]:[--track-reserve:28.5rem]"
      aria-labelledby="work-heading"
    >
      {/* Once the track is pinned, every pixel this header spends is a pixel
          the cards below don't get. On a short laptop screen the generous top
          padding is what pushed the panels up into this text, so it is bought
          back there and nowhere else. */}
      <div className="page flex flex-col gap-8 pt-28 lg:shrink-0 lg:gap-5 lg:pt-24 [@media(min-width:1024px)_and_(max-height:900px)]:gap-3 [@media(min-width:1024px)_and_(max-height:900px)]:pt-20">
        <Reveal className="flex items-center gap-4">
          <span className="label !text-signal-bright">
            <span className="tabular-nums">05</span>
            <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
            Output
          </span>
        </Reveal>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <MaskText
            as="h2"
            id="work-heading"
            text={"Systems\nwe've built."}
            className="display text-[length:var(--text-display-md)] text-bone lg:text-[clamp(2.25rem,3.4vw,3.25rem)]"
          />
          <Reveal delay={0.1} className="max-w-sm">
            <p className="leading-relaxed text-mute">
              {workSummary.screens} production screens across {workSummary.sectors} sectors. Hover
              a card to scroll the full page as it shipped.
            </p>
          </Reveal>
        </div>
      </div>

      <div
        ref={track}
        className="mt-14 flex flex-col gap-20 px-[var(--gutter)] pb-24 lg:mt-10 lg:min-h-0 lg:w-max lg:flex-1 lg:flex-row lg:gap-8 lg:pb-8 lg:will-change-transform [@media(min-width:1024px)_and_(max-height:900px)]:mt-6"
      >
        {work.map((sector, index) => (
          <SectorPanel key={sector.key} sector={sector} first={index === 0} />
        ))}
        <ClosingPanel />
      </div>
    </section>
  );
}

type Sector = (typeof work)[number];

function SectorPanel({ sector, first }: { sector: Sector; first: boolean }) {
  // Five screens on the stacked layout, three in the wider horizontal panel.
  const images = sector.images.slice(0, 5);

  return (
    <article className="flex flex-col lg:h-full lg:w-[min(76rem,86vw)] lg:shrink-0 lg:justify-center">
      <Reveal className="flex items-end justify-between gap-6 border-b border-line pb-5 lg:pb-6">
        <div>
          <span className="label !text-faint tabular-nums">{sector.index}</span>
          <h3 className="display mt-3 text-[length:var(--text-display-sm)] text-bone lg:text-[clamp(2rem,3.4vw,3.5rem)]">
            {sector.title}
          </h3>
        </div>
        <div className="text-right">
          <p className="hidden max-w-md text-balance leading-relaxed text-bone-dim lg:block">
            {sector.statement}
          </p>
          <p className="label mt-3 hidden lg:block">{sector.disciplines.join(" / ")}</p>
          <span className="label lg:hidden">{sector.code}</span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <p className="mt-5 max-w-lg leading-relaxed text-bone-dim lg:hidden">{sector.statement}</p>
      </Reveal>

      {/* Native horizontal scroll below lg; a fixed three-up grid above it. */}
      <div className="-mx-[var(--gutter)] mt-7 overflow-x-auto px-[var(--gutter)] pb-3 [scrollbar-width:none] lg:mx-0 lg:mt-8 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-3 lg:gap-6">
          {images.map((image, index) => (
            <WorkCard
              key={image.src}
              image={image}
              code={sector.code}
              caption={`${sector.title} · ${String(index + 1).padStart(2, "0")}`}
              priority={first && index === 0}
              className={
                index > 2
                  ? "w-[76vw] max-w-[22rem] shrink-0 lg:hidden"
                  : "w-[76vw] max-w-[22rem] shrink-0 lg:w-auto lg:max-w-none"
              }
            />
          ))}
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2 lg:mt-6">
        {sector.services.map((service) => (
          <li
            key={service}
            className="rounded-full border border-line bg-tint/[0.03] px-3 py-1.5 text-xs text-mute"
          >
            {service}
          </li>
        ))}
        <li className="hidden rounded-full border border-line px-3 py-1.5 text-xs text-faint lg:block">
          {sector.images.length} screens
        </li>
      </ul>
    </article>
  );
}

function ClosingPanel() {
  return (
    <article className="flex flex-col justify-center lg:h-full lg:w-[min(34rem,76vw)] lg:shrink-0">
      <Reveal>
        <span className="label !text-signal-bright">End of index</span>
        <p className="display mt-6 text-[length:var(--text-display-sm)] text-bone">
          Your system is the next one.
        </p>
        <a
          href="#contact"
          data-cursor="action"
          className="group mt-8 inline-flex w-fit items-center gap-3 border-b border-bone/25 pb-2 text-lg text-bone transition-colors hover:border-signal-bright hover:text-signal-bright"
        >
          Start a project
          <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
        </a>
      </Reveal>
    </article>
  );
}
