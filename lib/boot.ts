"use client";

/**
 * Boot handshake between the preloader and the hero.
 *
 * A DOM CustomEvent was the obvious choice and the wrong one: the preloader is
 * rendered above `{children}`, so its effect fires *before* the hero has
 * subscribed. On a repeat visit — or with reduced motion, where the preloader
 * resolves synchronously — the hero would miss the signal entirely and sit on
 * its timeout. A module-level flag can be read synchronously, so a late
 * subscriber is served immediately.
 */
let ready = false;
const listeners = new Set<() => void>();

export function markBootReady() {
  if (ready) return;
  ready = true;
  for (const listener of listeners) listener();
  listeners.clear();
}

export function isBootReady() {
  return ready;
}

/** Calls back immediately if boot already completed. Returns an unsubscribe. */
export function onBootReady(listener: () => void) {
  if (ready) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}
