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

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
