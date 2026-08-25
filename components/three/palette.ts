"use client";

import * as THREE from "three";

import type { Theme } from "@/lib/theme";

/**
 * The 3D layer's half of the theme.
 *
 * Two things change between environments, and only two: the colours, and the
 * blend mode. The blend mode is the one that actually matters — every glowing
 * element on this site is additive, and additive over a near-white page is
 * arithmetic that ends at white. On paper the same elements have to *subtract*
 * from the ground instead, which means normal blending and colours chosen to
 * sit below it rather than above it.
 *
 * Nothing here is a component. Geometry, buffers and materials are built once
 * and keep their identity for the life of the scene; a theme change only
 * damps these values into the uniforms that already exist.
 */
export type ScenePalette = {
  /** Additive in the dark, normal on paper. */
  blending: THREE.Blending;
  ambient: number;

  core: {
    base: THREE.Color;
    deep: THREE.Color;
    signal: THREE.Color;
    highlight: THREE.Color;
  };
  shell: {
    base: THREE.Color;
    deep: THREE.Color;
    signal: THREE.Color;
    highlight: THREE.Color;
  };
  halo: THREE.Color;
  dust: THREE.Color;
  /** Point opacity multiplier — paper needs less of everything. */
  dustOpacity: number;

  node: THREE.Color;
  nodeCore: THREE.Color;
  link: THREE.Color;
  linkOpacity: number;
};

const DARK: ScenePalette = {
  blending: THREE.AdditiveBlending,
  ambient: 0.4,

  // Near-black body, neutral graphite in the light, accent only at the
  // silhouette. Restraint is the whole point of the object.
  core: {
    base: new THREE.Color("#04050b"),
    deep: new THREE.Color("#171a22"),
    signal: new THREE.Color("#4f7fff"),
    highlight: new THREE.Color("#d6e6ff"),
  },
  shell: {
    base: new THREE.Color("#050a18"),
    deep: new THREE.Color("#0e1119"),
    signal: new THREE.Color("#25407e"),
    highlight: new THREE.Color("#6f8fd8"),
  },
  halo: new THREE.Color("#a9c6ff"),
  dust: new THREE.Color("#7fa3ff"),
  dustOpacity: 1,

  node: new THREE.Color("#4f7fff"),
  nodeCore: new THREE.Color("#dbe8ff"),
  link: new THREE.Color("#4f7fff"),
  linkOpacity: 0.34,
};

const LIGHT: ScenePalette = {
  blending: THREE.NormalBlending,
  ambient: 0.9,

  // Inverted relationship: on paper the object is the dense thing and the page
  // is the light source. Warm stone body, soft daylight falloff, and the same
  // blue held at the rim so the form still reads as engineered rather than
  // sculpted.
  core: {
    base: new THREE.Color("#a8a49a"),
    deep: new THREE.Color("#5f5c55"),
    signal: new THREE.Color("#3a63c8"),
    highlight: new THREE.Color("#ffffff"),
  },
  // The wireframe shell is additive in the dark, where near-black lines are
  // nearly free. Normal-blended on paper every line is paid for in full, so
  // the whole shell is pitched much closer to the ground.
  shell: {
    base: new THREE.Color("#c2c7d2"),
    deep: new THREE.Color("#a8afbe"),
    signal: new THREE.Color("#6b7ba6"),
    highlight: new THREE.Color("#d4dae5"),
  },
  halo: new THREE.Color("#5c78c4"),
  dust: new THREE.Color("#7186b8"),
  // Normal-blended points stack rather than saturate; the field needs far less.
  dustOpacity: 0.55,

  node: new THREE.Color("#4a6fd8"),
  nodeCore: new THREE.Color("#12224f"),
  link: new THREE.Color("#3a5fc0"),
  linkOpacity: 0.24,
};

export function scenePalette(theme: Theme): ScenePalette {
  return theme === "light" ? LIGHT : DARK;
}

/**
 * Eases a live uniform colour toward the palette. Frame-rate independent, so a
 * 30fps phone and a 120Hz laptop arrive at the same place at the same time.
 */
export function dampColor(
  current: THREE.Color,
  target: THREE.Color,
  lambda: number,
  delta: number,
) {
  const t = 1 - Math.exp(-lambda * delta);
  current.lerp(target, t);
}
