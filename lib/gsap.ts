"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point. Importing gsap from anywhere else in the app
 * risks registering the plugin twice under Fast Refresh.
 */
declare global {
  // eslint-disable-next-line no-var
  var __pwaGsapRegistered: boolean | undefined;
}

if (typeof window !== "undefined" && !globalThis.__pwaGsapRegistered) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  globalThis.__pwaGsapRegistered = true;
}

export { gsap, ScrollTrigger };
