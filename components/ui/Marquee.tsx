import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Marquee — Magic UI (`registry/magicui/marquee`, MIT).
 * https://magicui.design/docs/components/marquee
 *
 * Structure is upstream's: N copies of the same children, each translated a
 * full width so the seam never shows. Two things are adapted for this site —
 * the keyframes live in globals.css next to the rest of the animation
 * vocabulary rather than in a component-level `<style>`, and the whole thing
 * stops under `prefers-reduced-motion` (handled in the same stylesheet), where
 * a permanently scrolling rail is exactly the wrong thing to ship.
 */
export type MarqueeProps = ComponentPropsWithoutRef<"div"> & {
  className?: string;
  /** Run right-to-left instead. */
  reverse?: boolean;
  /** Hold position while the pointer is over the rail, so a label can be read. */
  pauseOnHover?: boolean;
  children: ReactNode;
  vertical?: boolean;
  /** Copies of `children`. Needs to be enough to overflow the widest viewport. */
  repeat?: number;
};

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden [--duration:38s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={index}
          aria-hidden={index > 0}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
