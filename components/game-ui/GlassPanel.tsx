"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { preferencesChangeEvent } from "@/lib/preferences";
import { createLiquidGlass } from "@/lib/liquid-glass";
import material from "./glass.module.css";
import ui from "./minecraft.module.css";

export function GlassPanel({ className = "", children, ...props }: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const desktop = matchMedia("(min-width: 821px) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let destroy: (() => void) | undefined;
    const update = () => {
      destroy?.();
      destroy = undefined;
      const root = document.documentElement;
      if (desktop.matches && !reduced.matches && !document.hidden &&
          root.dataset.graphics === "high" && root.dataset.motion === "full") {
        destroy = createLiquidGlass(element);
      }
    };
    update();
    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    window.addEventListener(preferencesChangeEvent, update);
    window.addEventListener("portfolio-motion-change", update);
    return () => {
      destroy?.();
      desktop.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener(preferencesChangeEvent, update);
      window.removeEventListener("portfolio-motion-change", update);
    };
  }, []);

  return (
    <section {...props} ref={ref} className={`${className} ${ui.panel} ${material.glass}`}>
      {children}
    </section>
  );
}
