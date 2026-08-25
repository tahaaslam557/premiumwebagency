import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation used by cursor / parallax follow loops. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Section links are written as bare hashes because they were only ever used on
 * the homepage. The header and footer now also render on the legal routes,
 * where `#work` means "a section of this page" and finds nothing — so off the
 * homepage the same link is resolved against the homepage instead.
 */
export function sectionHref(href: string, pathname: string) {
  return href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
}

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
