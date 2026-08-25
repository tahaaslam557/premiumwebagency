"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import type { WorkImage } from "@/data/portfolio";

type WorkCardProps = {
  image: WorkImage;
  code: string;
  caption: string;
  priority?: boolean;
  className?: string;
};

/**
 * A portfolio artifact. The source assets are full-page captures, so the card
 * shows the fold and scrolls the whole page on hover — the work reveals itself
 * the way the visitor would actually meet it.
 *
 * The travel distance is `-100% + card height`, which lands the bottom of the
 * image exactly on the bottom of the frame regardless of how tall the capture
 * is; duration scales with the aspect ratio so a 9,000px page doesn't blur past.
 */
export function WorkCard({ image, code, caption, priority = false, className }: WorkCardProps) {
  const ratio = image.height / image.width;
  const seconds = Math.round(Math.min(14, Math.max(4, ratio * 1.5)));

  return (
    <figure
      className={cn(
        "group/card relative overflow-hidden rounded-xl border border-line bg-elevate",
        // Below lg the section scrolls normally and the card can be whatever
        // height reads best. From lg it lives inside a pinned, viewport-tall
        // track, and height — not width — becomes the scarce dimension: a
        // 1366×768 laptop is *wide* enough for the 28rem card and nowhere near
        // tall enough for it, which is what used to drive the panels up into
        // the section header. `--track-reserve` is published by that track;
        // whatever it does not claim is the most a card may be.
        "[--card-h:20rem] sm:[--card-h:24rem]",
        "lg:[--card-h:min(24rem,calc(100svh-var(--track-reserve,30rem)))]",
        "xl:[--card-h:min(28rem,calc(100svh-var(--track-reserve,30rem)))]",
        className,
      )}
      data-cursor="view"
      data-cursor-label="VIEW"
    >
      <div className="relative h-[var(--card-h)] w-full overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 44vw, 28vw"
          quality={72}
          className="absolute inset-x-0 top-0 h-auto w-full max-w-none will-change-transform motion-safe:transition-transform motion-safe:ease-linear motion-safe:group-hover/card:translate-y-[calc(-100%+var(--card-h))]"
          style={{ transitionDuration: `${seconds}s` }}
        />
      </div>

      {/* Legibility scrim + metadata rail */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-void via-void/70 to-transparent"
        aria-hidden
      />

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <span className="label !text-bone-dim">{caption}</span>
        <span className="label !text-signal-bright">{code}</span>
      </figcaption>

      <span
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent transition-[box-shadow,border-color] duration-500 group-hover/card:ring-signal/40"
        aria-hidden
      />
    </figure>
  );
}
