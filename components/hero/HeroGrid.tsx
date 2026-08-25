"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useOptionalTheme } from "@/components/theme/ThemeProvider";
import { useHasAnyFinePointer, usePrefersReducedMotion } from "@/lib/hooks";

// Ships only to the client, and only once the hero has decided it wants it.
const RippleGrid = dynamic(
  () => import("@/components/backgrounds/RippleGrid").then((mod) => mod.RippleGrid),
  { ssr: false },
);

/**
 * The flat grid the site has always drawn. Also every fallback path below —
 * `reason` is stamped on it so which branch a given machine took is one glance
 * in devtools rather than a guess.
 */
function StaticGrid({ reason }: { reason: string }) {
  return (
    <div
      className="grid-field pointer-events-none absolute inset-0 opacity-[0.55]"
      data-hero-grid={`static:${reason}`}
      aria-hidden
    />
  );
}

/** Cheap one-off probe: a lost or refused context means we never swap. */
function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * Hero backdrop. The grid is the same object it always was — it just became
 * interactive: it bulges around the cursor and eases flat again behind it.
 *
 * Three audiences keep the original static grid instead, and none of them is
 * missing anything the page needs: reduced-motion users, devices with no
 * pointing device at all (there is no cursor to follow, and a full-screen
 * shader is the wrong thing to spend a phone's battery on), and anything
 * without a WebGL context.
 *
 * The pointer test is `any-pointer`, not `pointer`: a touchscreen laptop
 * reports its *primary* pointer as coarse and would otherwise be treated as a
 * phone, losing the ripple on exactly the machines that can run it.
 */
export function HeroGrid() {
  const reduced = usePrefersReducedMotion();
  const pointer = useHasAnyFinePointer();
  const theme = useOptionalTheme();

  const [gl, setGl] = useState<boolean | null>(null);
  // Read off the same custom properties the rest of the design system paints
  // from, so the rope flipping the theme re-colours the grid with everything
  // else — no second source of truth for the accent.
  const [accent, setAccent] = useState("#4f7fff");

  useEffect(() => setGl(supportsWebGL()), []);

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-signal")
      .trim();
    if (value) setAccent(value);
  }, [theme]);

  // `gl === null` only until the probe runs on mount; the static grid is the
  // honest thing to paint in that frame either way.
  const reason = reduced
    ? "reduced-motion"
    : !pointer
      ? "no-fine-pointer"
      : gl === false
        ? "no-webgl"
        : gl === null
          ? "probing"
          : null;

  if (reason) return <StaticGrid reason={reason} />;

  return (
    <div className="pointer-events-none absolute inset-0" data-hero-grid="ripple" aria-hidden>
      <RippleGrid
        gridColor={accent}
        // Paper takes ink far more readily than a dark ground takes light, and
        // the headline sits directly on top of this either way — it is a
        // backdrop, not a pattern to read.
        opacity={theme === "light" ? 0.26 : 0.6}
        // Roughly the 88px cell the flat grid has always used at desktop size,
        // so the hero keeps its rhythm and only gains the warp.
        gridSize={20}
        gridThickness={30}
        rippleIntensity={0.05}
        glowIntensity={theme === "light" ? 0.04 : 0.12}
        fadeDistance={1.6}
        vignetteStrength={2.2}
        mouseInteractionRadius={1.2}
        // Two device pixels per CSS pixel is invisible on grid lines this thin
        // and doubles the fragment count on a retina display.
        dpr={1.5}
        className="h-full w-full [&_canvas]:block"
      />
    </div>
  );
}
