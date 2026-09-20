"use client";

import { useEffect } from "react";

export function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactMotion = window.matchMedia("(max-width: 820px), (pointer: coarse)");

    const updatePolicy = () => {
      const disabled = new URLSearchParams(window.location.search).get("motion") === "off";
      root.dataset.motion = disabled ? "off" : reducedMotion.matches ? "reduced" : "full";
      root.dataset.motionIntensity = compactMotion.matches ? "compact" : "full";
      window.dispatchEvent(new Event("portfolio-motion-change"));
    };

    updatePolicy();
    reducedMotion.addEventListener("change", updatePolicy);
    compactMotion.addEventListener("change", updatePolicy);

    return () => {
      reducedMotion.removeEventListener("change", updatePolicy);
      compactMotion.removeEventListener("change", updatePolicy);
    };
  }, []);

  return null;
}
