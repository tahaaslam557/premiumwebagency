/**
 * Theme primitives shared by the provider, the lamp and the no-flash script.
 * Kept framework-free so the inline boot script can reuse the same key and the
 * same resolution order the React provider uses.
 */

export type Theme = "dark" | "light";

/**
 * The lamp is a small physical machine, so it gets one state variable rather
 * than a drawer of booleans: exactly one of these is true at any moment.
 */
export type LampState =
  | "idle"
  | "hover"
  | "dragging"
  | "threshold"
  | "switching"
  | "returning";

/** localStorage key. Only ever holds "dark" or "light". */
export const THEME_KEY = "pwa-theme";

/** Attribute the whole design system keys off. */
export const THEME_ATTR = "data-theme";

/** Pull distance, in pixels, that arms the switch. */
export const PULL_THRESHOLD = 120;
export const PULL_THRESHOLD_MOBILE = 90;

/** Pull below which the rope is simply hanging — no tension read. */
export const TENSION_START = 0.58;

/** How long the reality shift owns the screen, in seconds. */
export const SHIFT_EXPAND = 0.46;
export const SHIFT_FADE = 0.3;

export const THEME_COLOR: Record<Theme, string> = {
  dark: "#050507",
  light: "#f4f2ed",
};

/** Background the shift wave paints as it expands, per incoming theme. */
export const SHIFT_BACKGROUND: Record<Theme, string> = {
  dark: "#050507",
  light: "#f4f2ed",
};

/** The bloom at the lamp itself — the apparent source of the change. */
export const SHIFT_BLOOM: Record<Theme, string> = {
  dark: "rgba(125, 211, 252, 0.42)",
  light: "rgba(255, 252, 244, 0.95)",
};

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * The environment a visitor with no stored choice lands in.
 *
 * Deliberately a constant rather than `prefers-color-scheme`: the site opens
 * on paper for everyone, and dark is somewhere you arrive by pulling the rope.
 * The OS setting is not consulted at all — a first load has one answer.
 */
export const DEFAULT_THEME: Theme = "light";

/**
 * Runs before first paint, inlined in <head>. Resolution is two steps and no
 * more: the stored choice, then {@link DEFAULT_THEME}. It must not throw —
 * private-mode Safari denies localStorage access outright — and it must not
 * depend on anything the bundle has not loaded yet.
 */
export const NO_FLASH_SCRIPT = `(function(){try{
var k=${JSON.stringify(THEME_KEY)};
var s=null;try{s=localStorage.getItem(k)}catch(e){}
var t=(s==="dark"||s==="light")?s:${JSON.stringify(DEFAULT_THEME)};
var r=document.documentElement;
r.setAttribute(${JSON.stringify(THEME_ATTR)},t);
r.style.colorScheme=t;
}catch(e){}})();`;
