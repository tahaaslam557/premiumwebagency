/**
 * Ambient light behind the whole site.
 *
 * Three large accent blooms drifting slowly across the viewport, fixed rather
 * than scrolling, so the page reads as sitting inside a lit room instead of on
 * flat stock. Sections paint their own opaque `bg-void`, so this cannot live
 * underneath them — it is an overlay that blends, and the blend mode is what
 * keeps it off the type. See `.glow-field` in globals.css.
 *
 * No `use client`, no state, no JS at all: the drift is three CSS keyframes
 * and `prefers-reduced-motion` stops them in the same block that stops the
 * grain and the marquees.
 */
export function AmbientGlow() {
  return (
    <div className="glow-field" aria-hidden="true">
      <span className="glow-orb glow-orb-a" />
      <span className="glow-orb glow-orb-b" />
      <span className="glow-orb glow-orb-c" />
    </div>
  );
}
