"use client";

import { useEffect, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(reducedMotionQuery);
    const update = () => {
      setReducedMotion(mediaQuery.matches || document.documentElement.dataset.motion !== "full");
    };

    update();
    mediaQuery.addEventListener("change", update);
    window.addEventListener("portfolio-motion-change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
      window.removeEventListener("portfolio-motion-change", update);
    };
  }, []);

  return reducedMotion;
}
