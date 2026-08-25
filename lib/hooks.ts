"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** SSR-safe media query subscription. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

/** True only for devices with a real pointer — gates cursor and hover affordances. */
export function useHasFinePointer() {
  return useMediaQuery("(pointer: fine)");
}

/**
 * True when a mouse or trackpad exists at all, even if it is not the primary
 * input. `pointer: fine` describes only the *primary* pointer, so a laptop
 * with a touchscreen answers "coarse" and looks identical to a phone — which
 * is the wrong call for anything that merely wants to know whether a cursor
 * can ever appear on screen. Use this for that question, and
 * {@link useHasFinePointer} for "is touch what this person is actually using".
 */
export function useHasAnyFinePointer() {
  return useMediaQuery("(any-pointer: fine)");
}

/**
 * Normalised pointer position (-1..1) relative to the viewport, sampled on a
 * ref rather than state so consumers can read it inside a rAF loop without
 * re-rendering.
 */
export function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}

/** Fires once the element has been within the viewport margin. */
export function useInViewOnce<T extends HTMLElement>(rootMargin = "0px 0px -15% 0px") {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, seen]);

  return [ref, seen] as const;
}

/** Scroll offset in pixels, throttled to one read per frame. */
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setY(window.scrollY);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return y;
}

/** Locks body scroll while `locked` is true (mobile menu). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

/** Stable callback ref for imperative loops. */
export function useEvent<T extends (...args: never[]) => unknown>(handler: T) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  return useCallback((...args: Parameters<T>) => ref.current(...args), []) as T;
}

/**
 * useLayoutEffect on the client, useEffect on the server. GSAP setup must run
 * before paint, but React warns if useLayoutEffect is called during SSR.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
