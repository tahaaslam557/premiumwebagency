"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

/**
 * Ripple Grid — React Bits (`ts-tailwind/Backgrounds/RippleGrid`, MIT).
 * https://reactbits.dev/backgrounds/ripple-grid
 *
 * The shader is the upstream one, untouched. Four things are adapted for this
 * site, and only these:
 *
 *  1. Pointer tracking listens on `window`, not on the container. The layer
 *     sits behind the hero with `pointer-events: none` so it can never steal a
 *     click from the nav or the buttons — which also means it never receives a
 *     `mousemove` of its own. Coordinates are still resolved against the
 *     container's own rect, so the ripple lands where the cursor actually is.
 *  2. `gridColor` accepts any 3- or 6-digit hex, because it is read off a CSS
 *     custom property rather than hard-coded.
 *  3. The render loop is parked while the container is off-screen or the tab
 *     is hidden. The hero is one viewport tall; there is no reason to keep a
 *     fragment shader running for the rest of the page.
 *  4. `dpr` is a prop, so a weaker device can render fewer pixels.
 */

export type RippleGridProps = {
  enableRainbow?: boolean;
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  gridThickness?: number;
  fadeDistance?: number;
  vignetteStrength?: number;
  glowIntensity?: number;
  opacity?: number;
  gridRotation?: number;
  mouseInteraction?: boolean;
  mouseInteractionRadius?: number;
  dpr?: number;
  className?: string;
};

type Uniforms = Record<string, { value: unknown }>;

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((char) => char + char)
          .join("")
      : value;
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [1, 1, 1];
}

export function RippleGrid({
  enableRainbow = false,
  gridColor = "#ffffff",
  rippleIntensity = 0.05,
  gridSize = 10.0,
  gridThickness = 15.0,
  fadeDistance = 1.5,
  vignetteStrength = 2.0,
  glowIntensity = 0.1,
  opacity = 1.0,
  gridRotation = 0,
  mouseInteraction = true,
  mouseInteractionRadius = 1,
  dpr,
  className,
}: RippleGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const mouseInfluenceRef = useRef(0);
  const uniformsRef = useRef<Uniforms | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        dpr: dpr ?? Math.min(window.devicePixelRatio, 2),
        alpha: true,
      });
    } catch {
      // No WebGL context available. The caller paints a static grid behind
      // this layer, so bailing out here simply leaves that showing.
      return;
    }

    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const vert = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

    const frag = /* glsl */ `precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform bool enableRainbow;
uniform vec3 gridColor;
uniform float rippleIntensity;
uniform float gridSize;
uniform float gridThickness;
uniform float fadeDistance;
uniform float vignetteStrength;
uniform float glowIntensity;
uniform float opacity;
uniform float gridRotation;
uniform bool mouseInteraction;
uniform vec2 mousePosition;
uniform float mouseInfluence;
uniform float mouseInteractionRadius;
varying vec2 vUv;

float pi = 3.141592;

mat2 rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    if (gridRotation != 0.0) {
        uv = rotate(gridRotation * pi / 180.0) * uv;
    }

    float dist = length(uv);
    float func = sin(pi * (iTime - dist));
    vec2 rippleUv = uv + uv * func * rippleIntensity;

    if (mouseInteraction && mouseInfluence > 0.0) {
        vec2 mouseUv = (mousePosition * 2.0 - 1.0);
        mouseUv.x *= iResolution.x / iResolution.y;
        float mouseDist = length(uv - mouseUv);

        float influence = mouseInfluence * exp(-mouseDist * mouseDist / (mouseInteractionRadius * mouseInteractionRadius));

        float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
        rippleUv += normalize(uv - mouseUv) * mouseWave * rippleIntensity * 0.3;
    }

    vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
    vec2 b = abs(a);

    float aaWidth = 0.5;
    vec2 smoothB = vec2(
        smoothstep(0.0, aaWidth, b.x),
        smoothstep(0.0, aaWidth, b.y)
    );

    vec3 color = vec3(0.0);
    color += exp(-gridThickness * smoothB.x * (0.8 + 0.5 * sin(pi * iTime)));
    color += exp(-gridThickness * smoothB.y);
    color += 0.5 * exp(-(gridThickness / 4.0) * sin(smoothB.x));
    color += 0.5 * exp(-(gridThickness / 3.0) * smoothB.y);

    if (glowIntensity > 0.0) {
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.x);
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.y);
    }

    float ddd = exp(-2.0 * clamp(pow(dist, fadeDistance), 0.0, 1.0));

    vec2 vignetteCoords = vUv - 0.5;
    float vignetteDistance = length(vignetteCoords);
    float vignette = 1.0 - pow(vignetteDistance * 2.0, vignetteStrength);
    vignette = clamp(vignette, 0.0, 1.0);

    vec3 t;
    if (enableRainbow) {
        t = vec3(
            uv.x * 0.5 + 0.5 * sin(iTime),
            uv.y * 0.5 + 0.5 * cos(iTime),
            pow(cos(iTime), 4.0)
        ) + 0.5;
    } else {
        t = gridColor;
    }

    float finalFade = ddd * vignette;
    float alpha = length(color) * finalFade * opacity;
    gl_FragColor = vec4(color * t * finalFade * opacity, alpha);
}`;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      enableRainbow: { value: enableRainbow },
      gridColor: { value: hexToRgb(gridColor) },
      rippleIntensity: { value: rippleIntensity },
      gridSize: { value: gridSize },
      gridThickness: { value: gridThickness },
      fadeDistance: { value: fadeDistance },
      vignetteStrength: { value: vignetteStrength },
      glowIntensity: { value: glowIntensity },
      opacity: { value: opacity },
      gridRotation: { value: gridRotation },
      mouseInteraction: { value: mouseInteraction },
      mousePosition: { value: [0.5, 0.5] },
      mouseInfluence: { value: 0 },
      mouseInteractionRadius: { value: mouseInteractionRadius },
    };

    uniformsRef.current = uniforms as unknown as Uniforms;

    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex: vert, fragment: frag, uniforms });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w, h];
    };

    // Adaptation (1): the pointer is sampled globally and mapped into the
    // container, because the container itself never receives events.
    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      mouseInfluenceRef.current = inside ? 1 : 0;
      if (!inside) return;

      targetMouseRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: 1 - (event.clientY - rect.top) / rect.height,
      };
    };

    const handlePointerLeave = () => {
      mouseInfluenceRef.current = 0;
    };

    window.addEventListener("resize", resize);
    if (mouseInteraction) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.addEventListener("pointerleave", handlePointerLeave);
    }
    resize();

    let animationFrameId = 0;
    const render = (t: number) => {
      uniforms.iTime.value = t * 0.001;

      const lerpFactor = 0.1;
      mousePositionRef.current.x +=
        (targetMouseRef.current.x - mousePositionRef.current.x) * lerpFactor;
      mousePositionRef.current.y +=
        (targetMouseRef.current.y - mousePositionRef.current.y) * lerpFactor;

      const currentInfluence = uniforms.mouseInfluence.value;
      const targetInfluence = mouseInfluenceRef.current;
      uniforms.mouseInfluence.value += (targetInfluence - currentInfluence) * 0.05;

      uniforms.mousePosition.value = [
        mousePositionRef.current.x,
        mousePositionRef.current.y,
      ];

      renderer.render({ scene: mesh });
      animationFrameId = requestAnimationFrame(render);
    };

    // Adaptation (3): the loop only exists while the hero is on screen.
    const start = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(render);
    };
    const stop = () => {
      if (!animationFrameId) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    let onScreen = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0 },
    );
    observer.observe(container);

    const onVisibility = () => {
      if (document.hidden || !onScreen) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        window.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerleave", handlePointerLeave);
      }
      uniformsRef.current = null;
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.parentNode?.removeChild(gl.canvas);
    };
    // The GL context is built once. Every other prop is pushed into the live
    // uniforms by the effect below rather than rebuilding the scene.
  }, [dpr, mouseInteraction]);

  useEffect(() => {
    const uniforms = uniformsRef.current;
    if (!uniforms) return;

    uniforms.enableRainbow.value = enableRainbow;
    uniforms.gridColor.value = hexToRgb(gridColor);
    uniforms.rippleIntensity.value = rippleIntensity;
    uniforms.gridSize.value = gridSize;
    uniforms.gridThickness.value = gridThickness;
    uniforms.fadeDistance.value = fadeDistance;
    uniforms.vignetteStrength.value = vignetteStrength;
    uniforms.glowIntensity.value = glowIntensity;
    uniforms.opacity.value = opacity;
    uniforms.gridRotation.value = gridRotation;
    uniforms.mouseInteraction.value = mouseInteraction;
    uniforms.mouseInteractionRadius.value = mouseInteractionRadius;
  }, [
    enableRainbow,
    gridColor,
    rippleIntensity,
    gridSize,
    gridThickness,
    fadeDistance,
    vignetteStrength,
    glowIntensity,
    opacity,
    gridRotation,
    mouseInteraction,
    mouseInteractionRadius,
  ]);

  return (
    <div
      ref={containerRef}
      className={className ?? "relative h-full w-full overflow-hidden [&_canvas]:block"}
    />
  );
}
