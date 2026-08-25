"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { clamp } from "@/lib/utils";
import {
  PULL_THRESHOLD,
  PULL_THRESHOLD_MOBILE,
  TENSION_START,
  type LampState,
} from "@/lib/theme";
import { LampRope, ROPE, type RopeRefs } from "./LampRope";
import { useTheme } from "./ThemeProvider";

/**
 * Spring constants. Two regimes, because a cord being held and a cord being
 * released are not the same object: under the hand it tracks tightly with a
 * little lag, and once let go it is a damped mass on a line — one clear
 * overshoot, then settled. Anything springier reads as rubber.
 */
const DRAG = { k: 0.34, damp: 0.62 };
// Tuned to land: about two visible overshoots and dead still inside ~0.8s.
// Lighter damping than this reads as rubber; heavier kills the snap outright.
const RELEASE = { k: 0.17, damp: 0.7 };

/**
 * The spring integrates in fixed steps, not in frames. A per-frame spring is
 * really a per-refresh-rate spring: the same constants snap in half the time
 * on a 120Hz laptop and drag out to seconds on anything struggling. The cord
 * has to feel the same everywhere, so the loop accumulates real time and
 * spends it in 60Hz steps.
 */
const STEP = 1 / 60;
/** Never replay more than this after a tab-switch or a long frame. */
const MAX_CATCHUP = 0.25;

/** How far the cord leans toward an approaching hand. */
const HOVER_LIFT = 8;

/** Below this a pointer movement is a click, not a drag. */
const DRAG_SLOP = 6;

/** Past the threshold the cord goes stiff — you can feel the end of travel. */
const RESIST = 0.34;

const LABEL_IDLE = "Pull to change reality";
const LABEL_ARMED = "Reality shift ready";

type LampThemeToggleProps = {
  /** Header has collapsed on scroll: the mount rises, the cord shortens. */
  condensed?: boolean;
  /** Mobile navigation is covering the page — stand down. */
  hidden?: boolean;
};

/**
 * The signature interaction: grab, pull, release, and the environment changes.
 *
 * Everything between pointerdown and settle runs on refs and one rAF loop —
 * React re-renders only when the *named* state changes (six discrete values, a
 * handful of times per interaction), never per frame and never per pixel.
 *
 * The loop is not a background animation: it starts on approach and stops the
 * moment the cord is at rest, so an idle page does zero work here.
 */
export function LampThemeToggle({ condensed = false, hidden = false }: LampThemeToggleProps) {
  const { theme, switching, toggleTheme } = useTheme();
  const reduced = usePrefersReducedMotion();

  const [state, setState] = useState<LampState>("idle");

  const rootRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const cordRef = useRef<SVGPathElement>(null);
  const sheenRef = useRef<SVGPathElement>(null);
  const handleRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const coreRef = useRef<SVGRectElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  const refs: RopeRefs = {
    cord: cordRef,
    sheen: sheenRef,
    handle: handleRef,
    glow: glowRef,
    core: coreRef,
    ring: ringRef,
  };

  const anchorY = condensed ? ROPE.anchorCompact : ROPE.anchor;
  const restLen = condensed ? ROPE.restCompact : ROPE.rest;

  // Live geometry. Never state: it changes sixty times a second.
  const sim = useRef({
    pull: 0,
    pullV: 0,
    side: 0,
    sideV: 0,
    targetPull: 0,
    targetSide: 0,
    mode: "release" as "drag" | "release",
    anchorY,
    restLen,
    threshold: PULL_THRESHOLD,
  });

  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const clockRef = useRef({ last: 0, debt: 0 });
  const draggingRef = useRef(false);
  const armedRef = useRef(false);
  const hoverRef = useRef(false);
  /** Read inside window listeners, which are attached once. */
  const reducedRef = useRef(false);
  const movedRef = useRef(0);
  const startRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef<number | null>(null);
  /**
   * A drag that ends over a different element than it started on may or may
   * not produce a `click` — that is the browser's call, not ours. So the
   * suppression is a short window rather than a flag waiting to be cleared by
   * an event that might never arrive and would otherwise swallow the next
   * legitimate activation, including a keyboard one.
   */
  const suppressClickUntil = useRef(0);
  const stateRef = useRef<LampState>("idle");
  const settleTimer = useRef(0);

  reducedRef.current = reduced;

  const commitState = useCallback((next: LampState) => {
    if (stateRef.current === next) return;
    stateRef.current = next;
    setState(next);
  }, []);

  // Touch gets a shorter pull: a thumb has less travel than an arm, and the
  // handle must stay on screen for the whole gesture.
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    sim.current.threshold = coarse ? PULL_THRESHOLD_MOBILE : PULL_THRESHOLD;
  }, []);

  /** Writes the current simulation to the DOM. The only paint path. */
  const draw = useCallback(() => {
    const s = sim.current;
    const cx = ROPE.cx;
    const len = s.restLen + s.pull;
    const hx = cx + s.side;
    const hy = s.anchorY + len;

    // The cord lags its own endpoint: the bow trails lateral motion rather
    // than tracking it, which is what makes a whip look like a whip.
    const bow = s.side * 0.45 + s.sideV * 3.4;
    const c1x = cx + bow * 0.18;
    const c1y = s.anchorY + len * 0.32;
    const c2x = cx + s.side * 0.86 + bow * 0.3;
    const c2y = s.anchorY + len * 0.74;

    const d =
      "M " +
      cx +
      " " +
      s.anchorY +
      " C " +
      c1x.toFixed(2) +
      " " +
      c1y.toFixed(2) +
      ", " +
      c2x.toFixed(2) +
      " " +
      c2y.toFixed(2) +
      ", " +
      hx.toFixed(2) +
      " " +
      (hy - 15).toFixed(2);

    cordRef.current?.setAttribute("d", d);
    sheenRef.current?.setAttribute("d", d);
    handleRef.current?.setAttribute(
      "transform",
      `translate(${hx.toFixed(2)} ${hy.toFixed(2)})`,
    );

    const progress = clamp(s.pull / s.threshold, 0, 1);

    // Glow is held back until there is real tension, so resting a pointer on
    // the handle does not light the thing up like a toy.
    const tension = clamp((progress - TENSION_START) / (1 - TENSION_START), 0, 1);
    glowRef.current?.setAttribute("opacity", (0.1 + tension * 0.9).toFixed(3));
    coreRef.current?.setAttribute("opacity", (0.25 + progress * 0.75).toFixed(3));
    ringRef.current?.setAttribute("opacity", progress >= 1 ? "0.7" : "0");

    if (gripRef.current) {
      gripRef.current.style.transform = `translate3d(${s.side.toFixed(2)}px, ${(hy - 24).toFixed(2)}px, 0)`;
    }
    if (labelRef.current) {
      labelRef.current.style.transform = `translate3d(0, ${(hy - 5).toFixed(2)}px, 0)`;
    }
    rootRef.current?.style.setProperty("--pull", progress.toFixed(3));

    return progress;
  }, []);

  const tick = useCallback((now: number) => {
    const s = sim.current;
    const spring = s.mode === "drag" ? DRAG : RELEASE;
    const clock = clockRef.current;

    // First frame of a run has no previous timestamp to measure against, so it
    // is worth exactly one step rather than whatever the clock happened to say.
    const elapsed = clock.last ? Math.min((now - clock.last) / 1000, MAX_CATCHUP) : STEP;
    clock.last = now;
    clock.debt += elapsed;

    while (clock.debt >= STEP) {
      clock.debt -= STEP;
      s.pullV += (s.targetPull - s.pull) * spring.k;
      s.pullV *= spring.damp;
      s.pull += s.pullV;

      s.sideV += (s.targetSide - s.side) * spring.k;
      s.sideV *= spring.damp;
      s.side += s.sideV;
    }

    const progress = draw();

    if (draggingRef.current) {
      const armed = progress >= 1;
      if (armed !== armedRef.current) {
        armedRef.current = armed;
        commitState(armed ? "threshold" : "dragging");
      }
    }

    const settled =
      Math.abs(s.pullV) < 0.02 &&
      Math.abs(s.pull - s.targetPull) < 0.15 &&
      Math.abs(s.sideV) < 0.02 &&
      Math.abs(s.side - s.targetSide) < 0.15;

    // Only a released cord may end the loop; a held one keeps running even
    // when perfectly still, because the hand may move again.
    if (settled && s.mode === "release" && !draggingRef.current) {
      s.pull = s.targetPull;
      s.side = s.targetSide;
      s.pullV = 0;
      s.sideV = 0;
      draw();
      runningRef.current = false;
      // The resting state is read from what is actually true, not from
      // whichever transition happened to run last: a cord can finish moving
      // before the switch hands over, and asking "was I returning?" here left
      // the lamp stuck mid-word when it did.
      window.clearTimeout(settleTimer.current);
      commitState(hoverRef.current ? "hover" : "idle");
      return;
    }

    frameRef.current = requestAnimationFrame(tick);
  }, [commitState, draw]);

  const run = useCallback(() => {
    if (runningRef.current || reduced) return;
    runningRef.current = true;
    // A stopped loop has no elapsed time to account for; start the clock fresh
    // so a cord that has been at rest for a minute does not owe a minute.
    clockRef.current.last = 0;
    clockRef.current.debt = 0;
    frameRef.current = requestAnimationFrame(tick);
  }, [reduced, tick]);

  // Horizontal placement is measured, not assumed: past the grid's max width
  // the content edge and the viewport edge diverge, and a cord that hangs from
  // the wrong one stops looking bolted to anything.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const edge = document.querySelector<HTMLElement>("[data-page-edge]");
      if (!edge) return;
      // clientWidth, not innerWidth: the classic scrollbar sits outside the
      // layout viewport and would drag the cord off the grid by its width.
      const viewport = document.documentElement.clientWidth;
      const padding = parseFloat(getComputedStyle(edge).paddingRight) || 0;
      const offset = viewport - edge.getBoundingClientRect().right + padding;
      root.style.setProperty("--lamp-right", `${Math.max(0, offset)}px`);
    };

    measure();
    window.addEventListener("resize", measure, { passive: true });

    const edge = document.querySelector<HTMLElement>("[data-page-edge]");
    const observer = edge ? new ResizeObserver(measure) : null;
    if (edge && observer) observer.observe(edge);

    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, []);

  // Geometry follows the header. Redraw immediately so a scroll-collapse does
  // not leave the cord hanging from where the header used to be.
  useEffect(() => {
    sim.current.anchorY = anchorY;
    sim.current.restLen = restLen;
    draw();
  }, [anchorY, restLen, draw]);

  useEffect(() => {
    draw();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.clearTimeout(settleTimer.current);
      runningRef.current = false;
    };
  }, [draw]);

  /** Origin for the reality shift: the handle, in viewport coordinates. */
  const originOfHandle = useCallback(() => {
    const rect = gripRef.current?.getBoundingClientRect();
    if (!rect) return undefined;
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  const release = useCallback(
    (trigger: boolean) => {
      const s = sim.current;
      s.mode = "release";
      // A cord let go under a hand that has not left still leans toward it.
      s.targetPull = !trigger && hoverRef.current ? HOVER_LIFT : 0;
      s.targetSide = 0;

      // The switch fires on release, not on reaching the threshold, so a pull
      // can always be aborted by dragging back up first.
      if (trigger) toggleTheme(originOfHandle());

      // With motion reduced there is no loop to run the cord home and no loop
      // to hand the state back, so this is the end of the gesture.
      if (reducedRef.current) {
        armedRef.current = false;
        commitState(hoverRef.current ? "hover" : "idle");
        return;
      }

      if (trigger) {
        // Recoil: the mechanism firing throws the cord past its rest length.
        s.pullV -= 5.5;
        commitState("switching");
        window.clearTimeout(settleTimer.current);
        settleTimer.current = window.setTimeout(() => {
          if (stateRef.current === "switching") commitState("returning");
        }, 420);
      } else {
        commitState("returning");
      }

      run();
    },
    [commitState, originOfHandle, run, toggleTheme],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();

      pointerRef.current = event.pointerId;
      draggingRef.current = true;
      armedRef.current = false;
      movedRef.current = 0;
      startRef.current = { x: event.clientX, y: event.clientY };

      const s = sim.current;
      s.mode = "drag";
      s.targetPull = s.pull;
      s.targetSide = s.side;

      try {
        gripRef.current?.setPointerCapture(event.pointerId);
      } catch {
        // Capture is an optimisation; the window listeners below are the
        // actual contract.
      }
      commitState("dragging");
      // A no-op under reduced motion: the gesture is still tracked and still
      // decides, it simply has nothing to animate.
      run();
    },
    [commitState, run],
  );

  // Move and release live on the window so a pull that leaves the button — or
  // the viewport entirely — still ends cleanly. These stay attached under
  // reduced motion: the drag is how a touch user reaches this control, and
  // "no animation" must not quietly mean "no gesture".
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!draggingRef.current || event.pointerId !== pointerRef.current) return;

      const dx = event.clientX - startRef.current.x;
      const dy = event.clientY - startRef.current.y;
      movedRef.current = Math.max(movedRef.current, Math.hypot(dx, dy));

      const s = sim.current;
      const raw = Math.max(0, dy);
      // Linear to the threshold, then progressively stiffer. The cord has an
      // end; pretending otherwise is where these interactions turn to rubber.
      const pull = raw <= s.threshold ? raw : s.threshold + (raw - s.threshold) * RESIST;

      s.targetPull = Math.min(pull, ROPE.maxPull);
      // Sideways travel is deliberately small: this is a cord on a fixed
      // mount, not a pendulum.
      s.targetSide = clamp(dx * 0.28, -22, 22);

      // With motion reduced there is no loop to notice the threshold, so the
      // gesture reports its own arming. The cord itself never moves.
      if (reducedRef.current) {
        const armed = s.targetPull >= s.threshold;
        if (armed !== armedRef.current) {
          armedRef.current = armed;
          commitState(armed ? "threshold" : "dragging");
        }
      }
    };

    const end = (event: PointerEvent) => {
      if (!draggingRef.current || event.pointerId !== pointerRef.current) return;
      draggingRef.current = false;
      pointerRef.current = null;
      armedRef.current = false;
      if (movedRef.current > DRAG_SLOP) suppressClickUntil.current = performance.now() + 400;
      release(sim.current.targetPull >= sim.current.threshold);
    };

    const cancel = (event: PointerEvent) => {
      if (!draggingRef.current || event.pointerId !== pointerRef.current) return;
      draggingRef.current = false;
      pointerRef.current = null;
      armedRef.current = false;
      if (movedRef.current > DRAG_SLOP) suppressClickUntil.current = performance.now() + 400;
      // A cancelled gesture never switches, however far it was pulled.
      release(false);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [commitState, release]);

  /**
   * Click covers both the keyboard — Enter and Space fire it natively — and a
   * plain tap. Dragging is the premium path, never the required one.
   */
  const onClick = useCallback(() => {
    // The drag that just ended already decided this one.
    if (performance.now() < suppressClickUntil.current) return;

    if (reduced) {
      toggleTheme(originOfHandle());
      return;
    }

    // Give the keyboard the same gesture in miniature: a quick tug that
    // reaches the threshold, then lets go.
    const s = sim.current;
    s.mode = "drag";
    s.targetPull = s.threshold * 1.06;
    commitState("dragging");
    run();
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => release(true), 190);
  }, [commitState, originOfHandle, reduced, release, run, toggleTheme]);

  const onPointerEnter = useCallback(() => {
    hoverRef.current = true;
    if (draggingRef.current) return;
    if (reduced) {
      // The microcopy is not motion; it still gets to appear.
      commitState("hover");
      return;
    }
    // The lamp notices the hand before it arrives.
    sim.current.mode = "drag";
    sim.current.targetPull = HOVER_LIFT;
    commitState("hover");
    run();
  }, [commitState, reduced, run]);

  const onPointerLeave = useCallback(() => {
    hoverRef.current = false;
    if (draggingRef.current) return;
    if (reduced) {
      commitState("idle");
      return;
    }
    sim.current.mode = "release";
    sim.current.targetPull = 0;
    sim.current.targetSide = 0;
    commitState("returning");
    run();
  }, [commitState, reduced, run]);

  // The switch itself flares the lamp: it is the source of the change, so it
  // must be the brightest thing on screen at the moment the wave leaves it.
  useEffect(() => {
    if (!switching || reduced) return;
    glowRef.current?.setAttribute("opacity", "1");
    coreRef.current?.setAttribute("opacity", "1");
  }, [switching, reduced]);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <div
      ref={rootRef}
      className="lamp"
      data-state={state}
      data-hidden={hidden ? "true" : "false"}
    >
      <LampRope anchorY={anchorY} refs={refs} />

      <span ref={labelRef} className="lamp-label" aria-hidden="true">
        {state === "threshold" ? LABEL_ARMED : LABEL_IDLE}
      </span>

      <button
        ref={gripRef}
        type="button"
        className="lamp-grip"
        // A dynamic label, not `aria-pressed`: "switch to light mode, not
        // pressed" is the announcement a toggle-button role would produce here,
        // and it says the action twice while stating the state backwards.
        aria-label={`Switch to ${nextTheme} mode`}
        // Hidden from the tab order only while the mobile menu covers it.
        tabIndex={hidden ? -1 : 0}
        data-cursor="action"
        data-cursor-label="PULL"
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
        onDragStart={(event) => event.preventDefault()}
      />
    </div>
  );
}
