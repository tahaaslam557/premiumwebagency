"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks";
import {
  isTheme,
  SHIFT_BACKGROUND,
  SHIFT_BLOOM,
  SHIFT_EXPAND,
  SHIFT_FADE,
  THEME_ATTR,
  THEME_COLOR,
  THEME_KEY,
  type Theme,
} from "@/lib/theme";

/** Where on screen the change appears to originate — the lamp handle. */
export type ShiftOrigin = { x: number; y: number };

type ThemeContextValue = {
  theme: Theme;
  /** True for the length of the reality shift, so the lamp can flare with it. */
  switching: boolean;
  setTheme: (theme: Theme, origin?: ShiftOrigin) => void;
  toggleTheme: (origin?: ShiftOrigin) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Owns the one piece of global visual state on the site.
 *
 * The theme is already correct on the element before React boots — the inline
 * script in <head> has run — so this provider's first job is to *read* the DOM
 * rather than write to it. Writing on mount would mean rendering one frame of
 * the wrong theme on every navigation.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [theme, setThemeState] = useState<Theme>("dark");
  const [switching, setSwitching] = useState(false);

  const shiftRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  /** Set the moment the user makes a choice; system changes stop applying. */
  const explicitRef = useRef(false);

  // Adopt whatever the boot script resolved, rather than assuming a default.
  // `apply` runs again here for one reason: the boot script deliberately does
  // not touch <meta name="theme-color">, because Next renders that tag and the
  // ordering between the two is not ours to rely on.
  useEffect(() => {
    const current = document.documentElement.getAttribute(THEME_ATTR);
    const resolved = isTheme(current) ? current : "dark";
    setThemeState(resolved);
    apply(resolved);
    explicitRef.current = readStored() !== null;
  }, []);

  // Follow the OS only while the user has never expressed a preference.
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (explicitRef.current) return;
      apply(mql.matches ? "light" : "dark");
      setThemeState(mql.matches ? "light" : "dark");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => () => void timelineRef.current?.kill(), []);

  const setTheme = useCallback(
    (next: Theme, origin?: ShiftOrigin) => {
      if (next === document.documentElement.getAttribute(THEME_ATTR)) return;

      explicitRef.current = true;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        // Private browsing refuses the write; the theme still changes for
        // this session, which is the part the user asked for.
      }

      const plate = shiftRef.current;

      // Reduced motion, or no plate yet: the change is a fact, not a scene.
      if (reduced || !plate) {
        apply(next);
        setThemeState(next);
        return;
      }

      timelineRef.current?.kill();

      // Default the origin to the lamp's corner so a keyboard toggle still
      // reads as coming from the same object.
      const x = origin?.x ?? window.innerWidth - 48;
      const y = origin?.y ?? 120;
      const reach = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      plate.style.setProperty("--shift-x", `${x}px`);
      plate.style.setProperty("--shift-y", `${y}px`);
      plate.style.setProperty("--shift-bg", SHIFT_BACKGROUND[next]);
      plate.style.setProperty("--shift-bloom", SHIFT_BLOOM[next]);
      plate.dataset.active = "true";
      plate.style.opacity = "1";

      const wave = { r: 0 };
      const draw = () => {
        plate.style.clipPath = `circle(${wave.r}px at ${x}px ${y}px)`;
      };
      draw();

      setSwitching(true);

      timelineRef.current = gsap
        .timeline({
          onComplete: () => {
            plate.dataset.active = "false";
            plate.style.clipPath = "";
            setSwitching(false);
          },
        })
        // The wave leaves the lamp and takes the screen.
        .to(wave, {
          r: reach * 1.05,
          duration: SHIFT_EXPAND,
          ease: "power2.inOut",
          onUpdate: draw,
        })
        // Covered, the environment is swapped. Nothing on screen moves.
        .add(() => {
          apply(next);
          setThemeState(next);
        })
        // And the plate dissolves, revealing the new environment underneath.
        .to(plate, { opacity: 0, duration: SHIFT_FADE, ease: "power1.out" });
    },
    [reduced],
  );

  const toggleTheme = useCallback(
    (origin?: ShiftOrigin) => {
      const current = document.documentElement.getAttribute(THEME_ATTR);
      setTheme(current === "light" ? "dark" : "light", origin);
    },
    [setTheme],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, switching, setTheme, toggleTheme }),
    [theme, switching, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <div ref={shiftRef} className="reality-shift" aria-hidden="true" />
    </ThemeContext.Provider>
  );
}

/** Writes the theme everywhere the browser, not React, is responsible for it. */
function apply(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute(THEME_ATTR, theme);
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return context;
}

/**
 * Theme for consumers that must not crash outside the provider — the 3D
 * layers, which are also rendered by isolated tooling and tests.
 */
export function useOptionalTheme(): Theme {
  return useContext(ThemeContext)?.theme ?? "dark";
}
