"use client";

import { useEffect, useState } from "react";

import { AIOrb } from "@/components/three/AIOrb";
import { ParticleField } from "@/components/three/ParticleField";
import { Scene } from "@/components/three/Scene";
import { useQuality } from "@/components/three/quality";
import { useOptionalTheme } from "@/components/theme/ThemeProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Hero 3D layer. Loaded on the client only and mounted a beat after the boot
 * screen clears, so the first paint is text — never a blank canvas.
 */
export function HeroScene() {
  const quality = useQuality();
  const reduced = usePrefersReducedMotion();
  // Read outside the Canvas and handed down: R3F's reconciler does not carry
  // React context across the boundary, but props cross it untouched.
  const theme = useOptionalTheme();
  const [chaos, setChaos] = useState(1);

  useEffect(() => {
    // The core "wakes up": it arrives unresolved and settles within a second.
    const timer = window.setTimeout(() => setChaos(0.48), 260);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        // Scroll velocity feeds turbulence — the object registers movement.
        const depth = Math.min(1, window.scrollY / (window.innerHeight || 1));
        setChaos(0.48 + depth * 0.42);
        frame = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  // `fov` is vertical, so a portrait viewport crops the horizontal field and the
  // core balloons. Small screens pull the camera back and lift the object into
  // the upper half, where the headline is not.
  const compact = quality.tier === "low";
  const cameraZ = compact ? 9.2 : quality.tier === "medium" ? 7.1 : 6.1;
  const offset: [number, number, number] = compact ? [0, 1.05, 0] : [0.45, -0.05, 0];

  return (
    <Scene quality={quality} cameraPosition={[0, 0, cameraZ]} fov={42}>
      <ambientLight intensity={theme === "light" ? 0.9 : 0.4} />
      <ParticleField
        count={quality.tier === "low" ? 180 : quality.tier === "medium" ? 340 : 520}
        theme={theme}
      />
      {/* Nudged off-centre so the core sits beside the headline, not behind it. */}
      <group position={offset}>
        <AIOrb
          quality={quality}
          chaos={reduced ? 0.2 : chaos}
          paused={reduced}
          theme={theme}
        />
      </group>
    </Scene>
  );
}
