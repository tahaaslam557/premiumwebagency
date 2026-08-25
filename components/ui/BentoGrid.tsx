"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Bento Grid — after Magic UI (`registry/magicui/bento-grid`, MIT).
 * https://magicui.design/docs/components/bento-grid
 *
 * The layout and the hover mechanic are upstream's: a card whose copy lifts to
 * make room for an action that is only there on hover. Everything cosmetic is
 * rebuilt on this site's tokens — upstream ships hard-coded neutral greys and
 * a `dark:` variant, which would have been a second, competing theme system
 * alongside the one the rope already drives. Radix icons and the shadcn button
 * are dropped with it; neither is in this project.
 */

export function BentoGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type BentoCardProps = {
  name: string;
  description: string;
  /** Marker in the corner — keeps the grid reading as an index, not a card wall. */
  index?: string;
  /** Tailwind span classes, e.g. "lg:col-span-2". */
  className?: string;
  /** Optional decorative layer behind the copy. */
  background?: ReactNode;
};

export function BentoCard({
  name,
  description,
  index,
  className,
  background,
}: BentoCardProps) {
  return (
    <article
      className={cn(
        "group relative flex min-h-[13.5rem] flex-col justify-end overflow-hidden bg-void p-7 transition-colors duration-500 hover:bg-elevate",
        className,
      )}
    >
      {background ? (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {background}
        </div>
      ) : null}

      {/* A hairline that draws itself across the top on hover — the same
          "system coming online" language the rest of the site uses. */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal-bright transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        aria-hidden
      />

      {index ? (
        <span className="label absolute right-6 top-6 !text-[0.625rem] !text-faint tabular-nums">
          {index}
        </span>
      ) : null}

      <div className="relative flex flex-col gap-3">
        <h3 className="text-[1.0625rem] font-medium leading-snug text-bone">{name}</h3>
        <p className="max-w-md text-sm leading-relaxed text-mute">{description}</p>
      </div>
    </article>
  );
}
