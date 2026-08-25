"use client";

import * as THREE from "three";

/**
 * A single, canvas-independent pointer source.
 *
 * The 3D canvases are decorative and carry `pointer-events: none`, so R3F's own
 * event system never sees a pointermove and `state.pointer` would stay at the
 * origin forever. One window-level listener feeds every scene instead — and it
 * costs one listener total rather than one per canvas.
 */
export const pointer = new THREE.Vector2(0, 0);

let listening = false;
let subscribers = 0;

function onMove(event: PointerEvent) {
  pointer.set(
    (event.clientX / window.innerWidth) * 2 - 1,
    -((event.clientY / window.innerHeight) * 2 - 1),
  );
}

function onLeave() {
  // Drift back to centre when the cursor leaves the document.
  pointer.set(0, 0);
}

/** Ref-counted so the listener exists only while a scene is mounted. */
export function subscribePointer() {
  subscribers += 1;
  if (!listening && typeof window !== "undefined") {
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    listening = true;
  }

  return () => {
    subscribers -= 1;
    if (subscribers <= 0 && listening) {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      listening = false;
      subscribers = 0;
    }
  };
}
