"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

import { cn } from "@/lib/utils";
import type { Quality } from "./quality";

type SceneProps = {
  children: ReactNode;
  quality: Quality;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  /** Stops the render loop entirely while the canvas is off-screen. */
  pauseOffscreen?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
};

/**
 * Shared Canvas host. Owns the two things every 3D surface on this site needs:
 * a device-appropriate pixel ratio, and a render loop that stops the moment the
 * canvas leaves the viewport.
 */
export function Scene({
  children,
  quality,
  className,
  cameraPosition = [0, 0, 4.2],
  fov = 42,
  pauseOffscreen = true,
  onVisibilityChange,
}: SceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!pauseOffscreen);

  useEffect(() => {
    if (!pauseOffscreen) return;
    const node = hostRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        onVisibilityChange?.(entry.isIntersecting);
      },
      { rootMargin: "160px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [pauseOffscreen, onVisibilityChange]);

  return (
    <div ref={hostRef} className={cn("h-full w-full", className)}>
      <Canvas
        dpr={quality.dpr}
        frameloop={visible ? "always" : "never"}
        camera={{ position: cameraPosition, fov, near: 0.1, far: 40 }}
        gl={{
          antialias: quality.tier === "high",
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        // The scene is decorative; the page reads the same without it.
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
