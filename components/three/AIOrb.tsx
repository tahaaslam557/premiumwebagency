"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  coreFragmentShader,
  coreVertexShader,
  haloFragmentShader,
  haloVertexShader,
} from "@/lib/shaders";
import { pointer as globalPointer, subscribePointer } from "@/lib/pointer";
import type { Theme } from "@/lib/theme";
import { dampColor, scenePalette } from "./palette";
import type { Quality } from "./quality";

type AIOrbProps = {
  quality: Quality;
  /** 0 = resolved and calm, 1 = unresolved and boiling. */
  chaos?: number;
  radius?: number;
  paused?: boolean;
  /**
   * Passed down as a prop rather than read from context: the Canvas runs on
   * its own reconciler, and a prop crosses that boundary without a bridge.
   */
  theme?: Theme;
};

/**
 * The procedural intelligence core: a noise-displaced isosurface, a wireframe
 * shell one step out from it, and a halo of drifting points. Everything is
 * generated — no external model, nothing to download.
 */
export function AIOrb({
  quality,
  chaos = 0.55,
  radius = 1,
  paused = false,
  theme = "dark",
}: AIOrbProps) {
  const palette = scenePalette(theme);
  const group = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);

  const smoothPointer = useRef(new THREE.Vector2(0, 0));
  const chaosRef = useRef(chaos);

  // Uniform objects must keep a stable identity for the life of the material.
  const coreUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: chaos },
      uAmplitude: { value: 0.2 },
      uFrequency: { value: 1.45 },
      uPointer: { value: new THREE.Vector2() },
      uPointerStrength: { value: 0 },
      // Seeded from the palette in play at mount; damped toward the new one
      // on every theme change, so the material is never rebuilt.
      uBase: { value: palette.core.base.clone() },
      uDeep: { value: palette.core.deep.clone() },
      uSignal: { value: palette.core.signal.clone() },
      uHighlight: { value: palette.core.highlight.clone() },
    }),
    [],
  );

  const shellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: chaos },
      uAmplitude: { value: 0.26 },
      uFrequency: { value: 0.95 },
      uPointer: { value: new THREE.Vector2() },
      uPointerStrength: { value: 0 },
      uBase: { value: palette.shell.base.clone() },
      uDeep: { value: palette.shell.deep.clone() },
      uSignal: { value: palette.shell.signal.clone() },
      uHighlight: { value: palette.shell.highlight.clone() },
    }),
    [],
  );

  const haloUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 4.2 },
      uChaos: { value: chaos },
      uPointer: { value: new THREE.Vector2() },
      uColor: { value: palette.halo.clone() },
    }),
    [],
  );

  const halo = useMemo(() => {
    const count = quality.halo;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Even distribution over a shell, with a little radial scatter.
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (1.24 + Math.random() * 0.55);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random();
      scales[i] = 0.35 + Math.random() * 0.9;
    }

    return { positions, seeds, scales, count };
  }, [quality.halo, radius]);

  useEffect(() => subscribePointer(), []);

  // With motion reduced the frame loop is parked, so the damping below never
  // runs — the palette has to be written straight into the uniforms instead.
  // The theme still changes; it simply does not travel.
  useEffect(() => {
    if (!paused) return;
    coreUniforms.uBase.value.copy(palette.core.base);
    coreUniforms.uDeep.value.copy(palette.core.deep);
    coreUniforms.uSignal.value.copy(palette.core.signal);
    coreUniforms.uHighlight.value.copy(palette.core.highlight);
    shellUniforms.uBase.value.copy(palette.shell.base);
    shellUniforms.uDeep.value.copy(palette.shell.deep);
    shellUniforms.uSignal.value.copy(palette.shell.signal);
    shellUniforms.uHighlight.value.copy(palette.shell.highlight);
    haloUniforms.uColor.value.copy(palette.halo);
  }, [paused, palette, coreUniforms, shellUniforms, haloUniforms]);

  useFrame((state, delta) => {
    if (paused) return;

    const t = state.clock.elapsedTime;
    const step = Math.min(delta, 0.05);

    smoothPointer.current.lerp(globalPointer, Math.min(1, step * 3.2));

    // Chaos is damped toward its target so scroll-driven changes never snap.
    chaosRef.current = THREE.MathUtils.damp(chaosRef.current, chaos, 3, step);

    const proximity = 1 - Math.min(1, smoothPointer.current.length());

    for (const uniforms of [coreUniforms, shellUniforms]) {
      uniforms.uTime.value = t;
      uniforms.uChaos.value = chaosRef.current;
      uniforms.uPointer.value.copy(smoothPointer.current);
      uniforms.uPointerStrength.value = proximity * 0.9;
    }

    haloUniforms.uTime.value = t;
    haloUniforms.uChaos.value = chaosRef.current;
    haloUniforms.uPointer.value.copy(smoothPointer.current);

    // The environment changes lighting and materials — it is never rebuilt.
    // 4.5 lands the new palette inside the theme transition's own window.
    dampColor(coreUniforms.uBase.value, palette.core.base, 4.5, step);
    dampColor(coreUniforms.uDeep.value, palette.core.deep, 4.5, step);
    dampColor(coreUniforms.uSignal.value, palette.core.signal, 4.5, step);
    dampColor(coreUniforms.uHighlight.value, palette.core.highlight, 4.5, step);
    dampColor(shellUniforms.uBase.value, palette.shell.base, 4.5, step);
    dampColor(shellUniforms.uDeep.value, palette.shell.deep, 4.5, step);
    dampColor(shellUniforms.uSignal.value, palette.shell.signal, 4.5, step);
    dampColor(shellUniforms.uHighlight.value, palette.shell.highlight, 4.5, step);
    dampColor(haloUniforms.uColor.value, palette.halo, 4.5, step);

    if (group.current) {
      // Idle rotation plus a shallow pointer parallax — presence, not pursuit.
      group.current.rotation.y += step * 0.075;
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        smoothPointer.current.y * 0.22,
        2.4,
        step,
      );
      group.current.position.x = THREE.MathUtils.damp(
        group.current.position.x,
        smoothPointer.current.x * 0.12,
        2.4,
        step,
      );
    }

    if (shellRef.current) {
      shellRef.current.rotation.y -= step * 0.11;
      shellRef.current.rotation.z += step * 0.03;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.012);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[radius, quality.detail]} />
        <shaderMaterial
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={coreUniforms}
        />
      </mesh>

      <mesh ref={shellRef} scale={1.22}>
        <icosahedronGeometry args={[radius, Math.max(2, quality.detail - 2)]} />
        <shaderMaterial
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={shellUniforms}
          wireframe
          transparent
          opacity={0.055}
          blending={palette.blending}
          depthWrite={false}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[halo.positions, 3]}
          />
          <bufferAttribute attach="attributes-aSeed" args={[halo.seeds, 1]} />
          <bufferAttribute attach="attributes-aScale" args={[halo.scales, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={haloVertexShader}
          fragmentShader={haloFragmentShader}
          uniforms={haloUniforms}
          transparent
          depthWrite={false}
          blending={palette.blending}
        />
      </points>
    </group>
  );
}
