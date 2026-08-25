export const EASE = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutQuint: [0.83, 0, 0.17, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
};

export const DURATION = {
  fast: 0.32,
  base: 0.6,
  slow: 0.9,
  reveal: 1.1,
};

export const BREAKPOINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/** How long the preloader may hold the page, in milliseconds. */
export const PRELOADER_MAX_MS = 1800;

/** Session key so the preloader shows once per visit, not once per route. */
export const PRELOADER_KEY = "pwa:booted";
