"use client";

import { useEffect, useRef } from "react";

/** Decorative, finite CSS motion: no canvas, timers or continuous JS frame loop. */
export function WorldAtmosphere() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
    });
    const visibility = () => { element.dataset.paused = String(document.hidden); };
    observer.observe(element);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <div ref={ref} className="world-atmosphere" aria-hidden="true">
    <span className="world-atmosphere-terrain" />
    <div className="world-atmosphere-particles"><i /><i /><i /><i /><i /><i /></div>
  </div>;
}
