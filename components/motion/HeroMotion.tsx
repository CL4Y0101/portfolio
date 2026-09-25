"use client";

import { useEffect, useRef } from "react";
import { useScrollProgress } from "./useScrollProgress";
import { worldMotionEnabled } from "./scroll-progress";

export function HeroMotion() {
  const backdropRef = useRef<HTMLDivElement>(null);
  useScrollProgress(backdropRef, { closest: ".hero-section", mode: "leave", onProgress: ({ progress, enabled }) => {
    const hero = backdropRef.current?.closest<HTMLElement>(".hero-section");
    hero?.style.setProperty("--spawn-travel", `${enabled ? progress * 40 : 0}px`);
    if (!enabled) {
      hero?.style.setProperty("--hero-parallax-x", "0px");
      hero?.style.setProperty("--hero-parallax-y", "0px");
    }
  } });

  useEffect(() => {
    const backdrop = backdropRef.current;
    const hero = backdrop?.closest<HTMLElement>(".hero-section");
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopPointer = window.matchMedia("(min-width: 821px) and (pointer: fine)");
    let frame = 0;

    const reset = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      hero.style.setProperty("--hero-parallax-x", "0px");
      hero.style.setProperty("--hero-parallax-y", "0px");
    };

    const handlePointer = (event: PointerEvent) => {
      if (!worldMotionEnabled()) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = hero.getBoundingClientRect();
        if (!worldMotionEnabled()) return reset();
        const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
        hero.style.setProperty("--hero-parallax-x", `${(x * 8).toFixed(2)}px`);
        hero.style.setProperty("--hero-parallax-y", `${(y * 6).toFixed(2)}px`);
      });
    };

    hero.addEventListener("pointermove", handlePointer, { passive: true });
    hero.addEventListener("pointerleave", reset);
    reducedMotion.addEventListener("change", reset);
    desktopPointer.addEventListener("change", reset);
    window.addEventListener("portfolio-motion-change", reset);

    return () => {
      window.cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", handlePointer);
      hero.removeEventListener("pointerleave", reset);
      reducedMotion.removeEventListener("change", reset);
      desktopPointer.removeEventListener("change", reset);
      window.removeEventListener("portfolio-motion-change", reset);
    };
  }, []);

  return (
    <div className="world-backdrop" ref={backdropRef} aria-hidden="true">
      <span className="world-layer world-layer-sky" />
      <span className="world-layer world-layer-ridge" />
      <span className="world-layer world-layer-ground" />
      <span className="world-coordinate">X 120&nbsp;&nbsp;Y 64&nbsp;&nbsp;Z 026</span>
    </div>
  );
}
