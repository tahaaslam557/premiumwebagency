"use client";

import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/data/site";

/** "Premium Web" / "Agency" — split once, at module scope. */
const words = site.name.trim().split(/\s+/);
const lead = words.slice(0, -1).join(" ") || site.name;
const tail = words.length > 1 ? words[words.length - 1] : "";

/**
 * The name, at display scale, running as a ribbon under everything else.
 *
 * The lockup is deliberately two-tone: the opening words are filled with the
 * same top-to-bottom type gradient the hero uses, and the last word is drawn
 * as an outline. That gives the eye a shape to hold onto — a solid mass and a
 * ghost — rather than one very long undifferentiated slab of letters, and it
 * gives the hover somewhere to land: the outline warms to the accent while
 * the ribbon holds still.
 *
 * The rail is masked at both edges rather than hard-cut by `overflow: hidden`,
 * so letters dissolve into the page instead of ending mid-curve, and a small
 * accent mark separates each repetition so the loop reads as a decision.
 *
 * Sizing, the stroke weight, the mark and the bloom all live in `footer.css`
 * next to each other — see the note there for why 9vw is the ceiling.
 *
 * Motion comes from <Marquee>, so `prefers-reduced-motion` stops it outright
 * through the rule in globals.css rather than needing a second mechanism here.
 * Stopped, it is still the wordmark — nothing is lost by holding still.
 */
export function FooterWordmark() {
  return (
    <Reveal
      distance={36}
      /* Not the shared `inView` config. That one holds a -12% bottom margin so
         mid-page sections do not fire while still half a screen away, but this
         is the last element in the document: the bottom 12% of the viewport is
         the only place it ever sits, and its own entrance offset pushes it
         further into that band, so the shared config can never trigger it. */
      viewport={{ once: true }}
      className="wordmark relative select-none pt-14 pb-3"
      aria-hidden="true"
    >
      <div className="wordmark-glow" />

      <Marquee
        pauseOnHover
        repeat={3}
        className="wordmark-rail relative [--duration:42s] [--gap:0.14em]"
      >
        <span className="wordmark-lockup">
          <span className="text-gradient-bone">{lead}</span>
          {tail ? <span className="wordmark-outline">{tail}</span> : null}
          <span className="wordmark-mark" />
        </span>
      </Marquee>

      {/* The wordmark is decoration; the readable name is already in the
          copyright line above. One accessible copy, not two. */}
      <span className="sr-only">{site.name}</span>
    </Reveal>
  );
}
