"use client";

import { useEffect, useRef } from "react";
import { createLiquidGlass } from "@/lib/liquid-glass";
import { preferencesChangeEvent } from "@/lib/preferences";
import styles from "./liquid-glass-cursor.module.css";

const buttonSelector = '[data-cursor="button"], button, a, [role="button"], input, select, textarea';
const textSelector = '[data-cursor="text"], p, h1, h2, h3, h4, h5, h6, label';

export function LiquidGlassCursor() {
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lens = lensRef.current;
    if (!lens) return;

    const desktop = matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const highContrast = matchMedia("(forced-colors: active)");
    let destroyGlass: (() => void) | undefined;
    let frame = 0;
    let x = -200;
    let y = -200;
    let previousTarget: Element | null = null;

    const enabled = () =>
      desktop.matches && !reduced.matches && !highContrast.matches && !document.hidden &&
      document.documentElement.dataset.motion === "full" &&
      document.documentElement.dataset.graphics !== "low";

    const hide = () => {
      lens.dataset.visible = "false";
      lens.dataset.pressed = "false";
      previousTarget = null;
    };

    const updatePolicy = () => {
      destroyGlass?.();
      destroyGlass = undefined;
      if (!enabled()) {
        hide();
        return;
      }
      if (document.documentElement.dataset.graphics === "high") {
        destroyGlass = createLiquidGlass(lens);
      }
    };

    const updateShape = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      if (element === previousTarget) return;
      previousTarget = element;

      const button = element?.closest(buttonSelector);
      if (button) {
        const bounds = button.getBoundingClientRect();
        lens.style.setProperty("--cursor-width", `${Math.min(220, Math.max(68, bounds.width + 20))}px`);
        lens.style.setProperty("--cursor-height", `${Math.min(96, Math.max(52, bounds.height + 16))}px`);
        lens.dataset.shape = "button";
      } else if (element?.closest(textSelector)) {
        lens.style.removeProperty("--cursor-width");
        lens.style.removeProperty("--cursor-height");
        lens.dataset.shape = "text";
      } else {
        lens.style.removeProperty("--cursor-width");
        lens.style.removeProperty("--cursor-height");
        lens.dataset.shape = "default";
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled() || event.pointerType !== "mouse" ||
          (event.target instanceof Element && event.target.closest("dialog[open]"))) {
        hide();
        return;
      }
      x = event.clientX;
      y = event.clientY;
      updateShape(event.target);
      lens.dataset.visible = "true";
      if (!frame) {
        frame = requestAnimationFrame(() => {
          lens.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
          frame = 0;
        });
      }
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && lens.dataset.visible === "true") lens.dataset.pressed = "true";
    };

    const hidePressed = () => {
      lens.dataset.pressed = "false";
    };

    updatePolicy();
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", hidePressed);
    window.addEventListener("blur", hide);
    window.addEventListener("portfolio-motion-change", updatePolicy);
    window.addEventListener(preferencesChangeEvent, updatePolicy);
    document.addEventListener("visibilitychange", updatePolicy);
    desktop.addEventListener("change", updatePolicy);
    reduced.addEventListener("change", updatePolicy);
    highContrast.addEventListener("change", updatePolicy);

    return () => {
      destroyGlass?.();
      if (frame) cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", hidePressed);
      window.removeEventListener("blur", hide);
      window.removeEventListener("portfolio-motion-change", updatePolicy);
      window.removeEventListener(preferencesChangeEvent, updatePolicy);
      document.removeEventListener("visibilitychange", updatePolicy);
      desktop.removeEventListener("change", updatePolicy);
      reduced.removeEventListener("change", updatePolicy);
      highContrast.removeEventListener("change", updatePolicy);
    };
  }, []);

  return <div ref={lensRef} className={styles.lens} data-visible="false" data-shape="default" aria-hidden="true" />;
}
