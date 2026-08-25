"use client";

import { useEffect, useState } from "react";

export type Quality = {
  tier: "high" | "medium" | "low";
  /** Icosahedron subdivision for the core mesh. */
  detail: number;
  /** Number of halo points. */
  halo: number;
  /** Nodes in the neural network scene. */
  nodes: number;
  dpr: [number, number];
};

const HIGH: Quality = { tier: "high", detail: 6, halo: 2600, nodes: 190, dpr: [1, 1.85] };
const MEDIUM: Quality = { tier: "medium", detail: 5, halo: 1400, nodes: 130, dpr: [1, 1.5] };
const LOW: Quality = { tier: "low", detail: 3, halo: 520, nodes: 64, dpr: [1, 1.25] };

/**
 * Picks a 3D budget from the device rather than the viewport alone — a small
 * window on a workstation should still get the full scene, and a large phone
 * should not.
 */
export function useQuality(): Quality {
  const [quality, setQuality] = useState<Quality>(MEDIUM);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 768;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

    if (coarse || narrow || cores <= 4 || memory <= 4) {
      setQuality(narrow || coarse ? LOW : MEDIUM);
      return;
    }
    setQuality(cores >= 8 ? HIGH : MEDIUM);
  }, []);

  return quality;
}
