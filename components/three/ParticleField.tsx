"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { pointer as globalPointer, subscribePointer } from "@/lib/pointer";
import type { Theme } from "@/lib/theme";
import { dampColor, scenePalette } from "./palette";

type ParticleFieldProps = {
  count?: number;
  depth?: number;
  spread?: number;
  speed?: number;
  theme?: Theme;
};

const VERTEX = /* glsl */ `
uniform float uSize;
attribute float aScale;
varying float vAlpha;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * (6.5 / -mvPosition.z);
  // Far particles fade so the field reads as depth, not as dirt on the screen.
  vAlpha = aScale * smoothstep(-24.0, -3.0, mvPosition.z);
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha * 0.3 * uOpacity);
  #include <colorspace_fragment>
}
`;

/** Slow ambient dust. Cheap, decorative, and never the subject of a section. */
export function ParticleField({
  count = 900,
  depth = 18,
  spread = 16,
  speed = 0.012,
  theme = "dark",
}: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null);
  const palette = scenePalette(theme);

  const { positions, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
      positions[i * 3 + 2] = -Math.random() * depth;
      scales[i] = 0.25 + Math.random() * 0.8;
    }
    return { positions, scales };
  }, [count, depth, spread]);

  const uniforms = useMemo(
    () => ({
      uSize: { value: 3.2 },
      uColor: { value: palette.dust.clone() },
      uOpacity: { value: palette.dustOpacity },
    }),
    // Seeded once; the theme arrives through damping below, not a rebuild.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => subscribePointer(), []);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    const step = Math.min(delta, 0.05);

    dampColor(uniforms.uColor.value, palette.dust, 4.5, step);
    uniforms.uOpacity.value = THREE.MathUtils.damp(
      uniforms.uOpacity.value,
      palette.dustOpacity,
      4.5,
      step,
    );

    ref.current.rotation.z += step * speed;
    ref.current.position.x = THREE.MathUtils.damp(
      ref.current.position.x,
      globalPointer.x * 0.35,
      2,
      step,
    );
    ref.current.position.y = THREE.MathUtils.damp(
      ref.current.position.y,
      globalPointer.y * 0.2,
      2,
      step,
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={palette.blending}
      />
    </points>
  );
}
