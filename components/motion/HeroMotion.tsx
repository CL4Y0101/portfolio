"use client";

import { useEffect, useRef } from "react";

export function HeroMotion() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const hero = backdrop?.closest<HTMLElement>(".hero-section");
    if (!hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopPointer = window.matchMedia("(min-width: 821px) and (pointer: fine)");
    let frame = 0;

    const reset = () => {
      hero.style.setProperty("--hero-parallax-x", "0px");
      hero.style.setProperty("--hero-parallax-y", "0px");
    };

    const handlePointer = (event: PointerEvent) => {
      if (reducedMotion.matches || !desktopPointer.matches || document.documentElement.dataset.motion !== "full") return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        hero.style.setProperty("--hero-parallax-x", `${(x * 8).toFixed(2)}px`);
        hero.style.setProperty("--hero-parallax-y", `${(y * 6).toFixed(2)}px`);
      });
    };

    hero.addEventListener("pointermove", handlePointer, { passive: true });
    hero.addEventListener("pointerleave", reset);
    reducedMotion.addEventListener("change", reset);
    desktopPointer.addEventListener("change", reset);

    return () => {
      window.cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", handlePointer);
      hero.removeEventListener("pointerleave", reset);
      reducedMotion.removeEventListener("change", reset);
      desktopPointer.removeEventListener("change", reset);
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
