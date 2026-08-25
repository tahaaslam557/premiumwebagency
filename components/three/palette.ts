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
  //
  // Two rules earn every value below, and an earlier pass broke both — which
  // is how the object arrived as a beige smudge under a shell the same colour
  // as the page it was drawn on:
  //
  //  1. Contrast against paper has to be *spent*, not saved. "Paper needs
  //     less" is true right up until less becomes none.
  //  2. `coreFragmentShader` only ever adds — `base`, then light on top of
  //     it — so `base` is the shadow, never the body colour. Set it mid-grey
  //     and the lit side just climbs toward the page and the form dissolves.
  //
  // Hence: deep slate in shadow, warm stone added back by the key light.
  core: {
    base: new THREE.Color("#3f4557"),
    deep: new THREE.Color("#b8b3a4"),
    signal: new THREE.Color("#2f56bd"),
    highlight: new THREE.Color("#f7f4ec"),
  },
  // The wireframe shell is additive in the dark, where near-black lines are
  // nearly free. Normal-blended on paper every line is paid for in full — so
  // it is pitched well under the ground rather than just beneath it, or the
  // lines simply are not there.
  shell: {
    base: new THREE.Color("#5c6683"),
    deep: new THREE.Color("#3d445c"),
    signal: new THREE.Color("#2b4894"),
    highlight: new THREE.Color("#78829e"),
  },
  halo: new THREE.Color("#4a63b4"),
  dust: new THREE.Color("#55689c"),
  // Normal-blended points stack rather than saturate, but they still have to
  // clear the paper to exist at all.
  dustOpacity: 0.8,

  node: new THREE.Color("#3558bd"),
  nodeCore: new THREE.Color("#12224f"),
  link: new THREE.Color("#2f4f9e"),
  linkOpacity: 0.38,
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
