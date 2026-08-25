"use client";

import { NeuralNetwork } from "@/components/three/NeuralNetwork";
import { Scene } from "@/components/three/Scene";
import { useQuality } from "@/components/three/quality";
import { useOptionalTheme } from "@/components/theme/ThemeProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Client-only 3D layer for the intelligence section. */
export function CoreScene({ progress }: { progress: number }) {
  const quality = useQuality();
  const reduced = usePrefersReducedMotion();
  const theme = useOptionalTheme();

  return (
    <Scene quality={quality} cameraPosition={[0, 0, 6.4]} fov={45}>
      <NeuralNetwork
        quality={quality}
        progress={reduced ? 1 : progress}
        radius={quality.tier === "low" ? 1.7 : 2.1}
        paused={reduced}
        theme={theme}
      />
    </Scene>
  );
}
