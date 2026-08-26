"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";

/** "Premium Web" / "Agency" — split once, at module scope. */
const words = site.name.trim().split(/\s+/);
const lead = words.slice(0, -1).join(" ") || site.name;
const tail = words.length > 1 ? words[words.length - 1] : "";

/** The size the text is measured at. Any value works; this one keeps the
 *  arithmetic in a comfortable range for sub-pixel widths. */
const PROBE_PX = 200;

/**
 * `useLayoutEffect` on the client, `useEffect` on the server. The fit has to
 * run before paint or the first frame shows the fallback size, but React
 * warns about layout effects during SSR — this is the standard shim.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * The name, once, at the foot of the page.
 *
 * Sizing is measured rather than guessed. Every viewport-unit size is a bet
 * that a particular typeface, at a particular weight and tracking, happens to
 * measure a particular multiple of its font size — and that bet loses the
 * moment the face changes or a fallback loads. So the text is laid out at a
 * known probe size, measured, and scaled by the ratio of the space available
 * to the space it took. Text width is linear in font size, so one pass lands
 * it exactly; there is no search and no overshoot.
 *
 * That runs again on resize, and again when `document.fonts` settles, because
 * the first measurement can happen against fallback metrics.
 *
 * The lockup is two-tone: the opening words carry the hero's type gradient
 * with a slow accent sheen travelling across it, and the last word is drawn
 * as an outline that warms to the accent on hover. Solid mass and ghost, so
 * the eye has a shape to hold rather than one long run of letters.
 */
export function FooterWordmark() {
  const hostRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const host = hostRef.current;
    const text = textRef.current;
    if (!host || !text) return;

    const fit = () => {
      // `clientWidth` is the content box, so the padding that aligns the
      // wordmark with the footer grid is already excluded.
      const available = host.clientWidth;
      if (!available) return;

      text.style.fontSize = `${PROBE_PX}px`;
      const measured = text.getBoundingClientRect().width;
      if (!measured) return;

      text.style.fontSize = `${(available / measured) * PROBE_PX}px`;
    };

    fit();

    // Width only. The observed box also changes height every time `fit` runs,
    // and reacting to that would drive the observer round in circles.
    let lastWidth = Math.round(host.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const width = Math.round(entries[0].contentRect.width);
      if (width === lastWidth) return;
      lastWidth = width;
      fit();
    });
    observer.observe(host);

    // The first pass can land while the display face is still swapping in,
    // and fallback metrics are not the metrics we are fitting to.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

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

      <div ref={hostRef} className="relative">
        <span ref={textRef} className="wordmark-lockup">
          <span className="wordmark-lead">{lead}</span>
          {tail ? <span className="wordmark-outline">{tail}</span> : null}
        </span>
      </div>

      {/* The wordmark is decoration; the readable name is already in the
          copyright line above. One accessible copy, not two. */}
      <span className="sr-only">{site.name}</span>
    </Reveal>
  );
}
