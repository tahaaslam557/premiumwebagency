"use client";

import { useEffect, useRef, useState } from "react";

import { useHasFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { lerp } from "@/lib/utils";

type CursorState = {
  label: string;
  mode: "default" | "action" | "view" | "explore" | "text";
};

const IDLE: CursorState = { label: "", mode: "default" };

/**
 * Two-part cursor: an instant dot and a trailing ring that carries a label.
 * Elements opt in with `data-cursor="view|explore|action|text"` and an optional
 * `data-cursor-label`. Touch, coarse pointers and reduced-motion users keep the
 * native cursor — nothing here is required to operate the site.
 *
 * Every colour here is the accent role — `--color-signal` / `-bright` — read
 * live from the custom property rather than captured in React state. The rope
 * rebinds those on `<html>`, so the cursor is already the new colour on the
 * frame the theme flips; there is nothing here to keep in step by hand.
 */
export function Cursor() {
  const fine = useHasFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const modeRef = useRef<CursorState["mode"]>("default");
  const labelRef = useRef("");
  const [state, setState] = useState<CursorState>(IDLE);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.body.removeAttribute("data-custom-cursor");
      return;
    }
    document.body.setAttribute("data-custom-cursor", "on");
    return () => document.body.removeAttribute("data-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      const el = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const mode = (el?.dataset.cursor as CursorState["mode"] | undefined) ?? "default";
      if (!el) {
        if (modeRef.current !== "default") {
          modeRef.current = "default";
          setState(IDLE);
        }
        return;
      }
      const label = el.dataset.cursorLabel ?? "";
      if (modeRef.current !== mode || labelRef.current !== label) {
        modeRef.current = mode;
        labelRef.current = label;
        setState({ mode, label });
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const tick = () => {
      ring.x = lerp(ring.x, target.x, 0.16);
      ring.y = lerp(ring.y, target.y, 0.16);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const hasLabel = state.label.length > 0;
  const expanded = state.mode !== "default";

  const ringSize = expanded ? (hasLabel ? 92 : 60) : 34;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border backdrop-blur-[1px] transition-[width,height,opacity,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          backgroundColor: expanded ? "color-mix(in oklab, var(--color-signal) 14%, transparent)" : "transparent",
          borderColor: expanded ? "color-mix(in oklab, var(--color-signal-bright) 65%, transparent)" : "color-mix(in oklab, var(--color-signal) 45%, transparent)",
        }}
      >
        {hasLabel ? (
          <span className="label !text-[0.5625rem] !text-signal-bright whitespace-nowrap">
            {state.label}
          </span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 rounded-full bg-signal transition-[width,height,opacity] duration-200"
        style={{
          width: pressed ? 10 : expanded ? 0 : 5,
          height: pressed ? 10 : expanded ? 0 : 5,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
