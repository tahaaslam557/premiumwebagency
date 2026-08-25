"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { pointer as globalPointer, subscribePointer } from "@/lib/pointer";
import type { Theme } from "@/lib/theme";
import { dampColor, scenePalette } from "./palette";
import type { Quality } from "./quality";

type NeuralNetworkProps = {
  quality: Quality;
  /** 0 = scattered noise, 1 = a fully organised, connected lattice. */
  progress: number;
  radius?: number;
  paused?: boolean;
  /** Props cross the Canvas reconciler boundary; React context does not. */
  theme?: Theme;
};

const NODE_VERTEX = /* glsl */ `
uniform float uSize;
uniform float uProgress;
attribute float aScale;
varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * (18.0 / -mvPosition.z);
  vAlpha = mix(0.35, 1.0, uProgress) * aScale;
}
`;

const NODE_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uCoreColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.24, 0.0, d);
  float glow = smoothstep(0.5, 0.08, d);
  vec3 color = mix(uColor, uCoreColor, core);
  gl_FragColor = vec4(color, glow * vAlpha);
  #include <colorspace_fragment>
}
`;

/** Deterministic pseudo-random so the scene is identical every mount. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/**
 * Chaos → intelligence, expressed literally: nodes begin as scattered noise and
 * migrate onto an even spherical lattice as `progress` rises, with the synaptic
 * lines fading in only once the structure exists.
 */
export function NeuralNetwork({
  quality,
  progress,
  radius = 2.1,
  paused = false,
  theme = "dark",
}: NeuralNetworkProps) {
  const palette = scenePalette(theme);
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);
  const progressRef = useRef(0);
  const smoothPointer = useRef(new THREE.Vector2());

  const model = useMemo(() => {
    const count = quality.nodes;
    const random = seeded(20260825);

    const chaotic = new Float32Array(count * 3);
    const ordered = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const live = new Float32Array(count * 3);

    // Fibonacci sphere gives the resolved state an even, engineered distribution.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;

      ordered[i * 3] = Math.cos(theta) * r * radius;
      ordered[i * 3 + 1] = y * radius;
      ordered[i * 3 + 2] = Math.sin(theta) * r * radius;

      const spread = radius * 2.5;
      chaotic[i * 3] = (random() - 0.5) * spread;
      chaotic[i * 3 + 1] = (random() - 0.5) * spread;
      chaotic[i * 3 + 2] = (random() - 0.5) * spread;

      scales[i] = 0.45 + random() * 0.85;
      live[i * 3] = chaotic[i * 3];
      live[i * 3 + 1] = chaotic[i * 3 + 1];
      live[i * 3 + 2] = chaotic[i * 3 + 2];
    }

    // Connect each node to its nearest neighbours in the *resolved* layout, so
    // the lattice that appears is the one the nodes are travelling toward.
    const neighbours = 3;
    const edges: Array<[number, number]> = [];
    const seen = new Set<string>();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();

    for (let i = 0; i < count; i += 1) {
      a.fromArray(ordered, i * 3);
      const distances: Array<{ index: number; d: number }> = [];
      for (let j = 0; j < count; j += 1) {
        if (i === j) continue;
        b.fromArray(ordered, j * 3);
        distances.push({ index: j, d: a.distanceToSquared(b) });
      }
      distances.sort((x, y) => x.d - y.d);
      for (let k = 0; k < neighbours; k += 1) {
        const j = distances[k]?.index;
        if (j === undefined) continue;
        const key = i < j ? `${i}:${j}` : `${j}:${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push([i, j]);
      }
    }

    const linePositions = new Float32Array(edges.length * 6);

    return { count, chaotic, ordered, scales, live, edges, linePositions };
  }, [quality.nodes, radius]);

  const nodeUniforms = useMemo(
    () => ({
      uSize: { value: 6.5 },
      uProgress: { value: 0 },
      uColor: { value: palette.node.clone() },
      uCoreColor: { value: palette.nodeCore.clone() },
    }),
    // Built once. The theme reaches these by damping, never by rebuilding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => subscribePointer(), []);

  // The line material has no colour prop — it is owned by the palette. Unlike
  // the node uniforms this one is set outright rather than damped: the swap
  // happens while the reality shift covers the screen, and under reduced
  // motion nothing is meant to travel anyway.
  useEffect(() => {
    if (lineMaterialRef.current) lineMaterialRef.current.color.copy(palette.link);
    if (!paused) return;
    nodeUniforms.uColor.value.copy(palette.node);
    nodeUniforms.uCoreColor.value.copy(palette.nodeCore);
  }, [paused, palette, nodeUniforms]);

  useFrame((state, delta) => {
    if (paused) return;
    const step = Math.min(delta, 0.05);

    progressRef.current = THREE.MathUtils.damp(progressRef.current, progress, 4, step);
    const p = progressRef.current;
    const eased = p * p * (3 - 2 * p);

    smoothPointer.current.lerp(globalPointer, Math.min(1, step * 2.4));

    const { count, chaotic, ordered, live, edges, linePositions } = model;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i += 1) {
      const o = i * 3;
      // A little residual drift keeps the resolved lattice alive rather than frozen.
      const drift = (1 - eased) * 0.35 + 0.04;
      const wobble = Math.sin(t * 0.7 + i * 0.37) * drift;

      live[o] = THREE.MathUtils.lerp(chaotic[o], ordered[o], eased) + wobble * 0.4;
      live[o + 1] = THREE.MathUtils.lerp(chaotic[o + 1], ordered[o + 1], eased) + wobble * 0.3;
      live[o + 2] = THREE.MathUtils.lerp(chaotic[o + 2], ordered[o + 2], eased) + wobble * 0.4;
    }

    const positionAttr = pointsRef.current?.geometry.getAttribute("position") as
      | THREE.BufferAttribute
      | undefined;
    if (positionAttr) {
      (positionAttr.array as Float32Array).set(live);
      positionAttr.needsUpdate = true;
    }

    for (let e = 0; e < edges.length; e += 1) {
      const [i, j] = edges[e];
      const o = e * 6;
      linePositions[o] = live[i * 3];
      linePositions[o + 1] = live[i * 3 + 1];
      linePositions[o + 2] = live[i * 3 + 2];
      linePositions[o + 3] = live[j * 3];
      linePositions[o + 4] = live[j * 3 + 1];
      linePositions[o + 5] = live[j * 3 + 2];
    }

    const lineAttr = linesRef.current?.geometry.getAttribute("position") as
      | THREE.BufferAttribute
      | undefined;
    if (lineAttr) {
      (lineAttr.array as Float32Array).set(linePositions);
      lineAttr.needsUpdate = true;
    }

    dampColor(nodeUniforms.uColor.value, palette.node, 4.5, step);
    dampColor(nodeUniforms.uCoreColor.value, palette.nodeCore, 4.5, step);

    if (lineMaterialRef.current) {
      // Connections only earn their opacity once the structure has formed.
      // The ceiling is the palette's, because normal-blended lines on paper
      // read far heavier than additive ones on a black page.
      lineMaterialRef.current.opacity =
        Math.max(0, (eased - 0.25) / 0.75) * palette.linkOpacity;
    }

    nodeUniforms.uProgress.value = eased;

    if (group.current) {
      group.current.rotation.y += step * (0.16 - eased * 0.1);
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        smoothPointer.current.y * 0.28,
        2,
        step,
      );
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        smoothPointer.current.x * 0.14,
        2,
        step,
      );
      const scale = THREE.MathUtils.lerp(0.82, 1, eased);
      group.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={group}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[model.linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          transparent
          opacity={0}
          depthWrite={false}
          blending={palette.blending}
        />
      </lineSegments>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[model.live, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[model.scales, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={NODE_VERTEX}
          fragmentShader={NODE_FRAGMENT}
          uniforms={nodeUniforms}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </points>
    </group>
  );
}
