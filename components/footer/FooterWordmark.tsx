"use client";

import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/data/site";

/**
 * The name, once, at the bottom of everything — full-bleed and moving.
 *
 * Sized in `vw` so it always spans the viewport rather than being a fixed
 * size that happens to fit one screen. Painted with the same top-to-bottom
 * type gradient the hero uses, so the letterforms fade as they descend.
 *
 * The leading leaves room for the descenders in "g" and "y". A tighter line
 * box cropped them mid-curve, which reads as a clipping bug rather than as a
 * deliberate crop — and this is the company's own name, which is the last
 * place to look accidentally broken.
 *
 * Motion comes from <Marquee>, so `prefers-reduced-motion` stops it outright
 * through the rule in globals.css rather than needing a second mechanism here.
 * Stopped, it is still the wordmark — nothing is lost by holding still.
 */
export function FooterWordmark() {
  return (
    <div
      className="relative select-none overflow-hidden pt-12 pb-2"
      aria-hidden="true"
    >
      <Marquee
        pauseOnHover
        repeat={3}
        className="[--duration:34s] [--gap:0.2em]"
      >
        <span className="display block whitespace-nowrap text-[12vw] leading-[1.06] text-gradient-bone">
          {site.name}
        </span>
      </Marquee>

      {/* The wordmark is decoration; the readable name is already in the
          copyright line above. One accessible copy, not two. */}
      <span className="sr-only">{site.name}</span>
    </div>
  );
}
