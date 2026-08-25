"use client";

import type { RefObject } from "react";

/** Rail geometry. The toggle does the maths in this space; nothing else does. */
export const ROPE = {
  /** Rail width — the SVG viewport the cord lives in. */
  width: 96,
  /** Rail height. Must clear anchor + MAX_PULL + handle overhang. */
  height: 420,
  /** Cord x at rest, in rail space. */
  cx: 48,
  /** Header bottom edge in px — where the mount is bolted. */
  anchor: 72,
  anchorCompact: 60,
  /** Slack the cord hangs with before anyone touches it. */
  rest: 72,
  restCompact: 58,
  /** Hard stop. The cord is a cord, not elastic. */
  maxPull: 190,
} as const;

export type RopeRefs = {
  cord: RefObject<SVGPathElement | null>;
  sheen: RefObject<SVGPathElement | null>;
  handle: RefObject<SVGGElement | null>;
  glow: RefObject<SVGCircleElement | null>;
  core: RefObject<SVGRectElement | null>;
  ring: RefObject<SVGCircleElement | null>;
};

/**
 * The physical object: a mount bolted to the header, a cord, and a machined
 * handle. It holds no state and never re-renders during a pull — every moving
 * part is addressed by ref and written once per frame by the toggle's loop.
 *
 * Deliberately filter-free. A `feGaussianBlur` here would be the single most
 * expensive thing on a phone; the glow is a radial gradient instead, which
 * costs nothing and looks the same at this size.
 */
export function LampRope({ anchorY, refs }: { anchorY: number; refs: RopeRefs }) {
  const { width, height, cx } = ROPE;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="lamp-cord-gradient" x1="0" y1="0" x2="0" y2="1">
          {/* The cord emerges from shadow at the mount and gains material as
              it descends toward the handle you are meant to reach for. */}
          <stop offset="0%" stopColor="var(--color-faint)" />
          <stop offset="55%" stopColor="var(--color-mute)" />
          <stop offset="100%" stopColor="var(--color-bone-dim)" />
        </linearGradient>

        <radialGradient id="lamp-glow-gradient">
          <stop offset="0%" stopColor="var(--color-signal-bright)" stopOpacity="0.55" />
          <stop offset="45%" stopColor="var(--color-signal)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Mount — a plate and a socket, sitting on the header's edge. */}
      <g transform={`translate(${cx} ${anchorY})`}>
        <rect className="lamp-mount-plate" x={-11} y={-3} width={22} height={6} rx={3} />
        <rect className="lamp-mount-socket" x={-3.5} y={-1.5} width={7} height={5} rx={2.5} />
      </g>

      <path ref={refs.cord} className="lamp-cord" />
      <path ref={refs.sheen} className="lamp-cord-sheen" />

      {/* Handle. Transform is rewritten once per frame, so the group carries no
          static translate of its own. */}
      <g ref={refs.handle}>
        <circle ref={refs.glow} className="lamp-glow" r={30} opacity={0} />
        <circle ref={refs.ring} className="lamp-handle-ring" r={15} opacity={0} />
        <rect className="lamp-handle-ferrule" x={-2.5} y={-15} width={5} height={5} rx={1.5} />
        <rect className="lamp-handle-body" x={-5} y={-11} width={10} height={24} rx={5} />
        <rect
          ref={refs.core}
          className="lamp-handle-core"
          x={-1.5}
          y={-6}
          width={3}
          height={14}
          rx={1.5}
          opacity={0.25}
        />
      </g>
    </svg>
  );
}
