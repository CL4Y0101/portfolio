"use client";

import { useEffect, useRef, type CanvasHTMLAttributes } from "react";
import { preferencesChangeEvent } from "@/lib/preferences";
import { themeChangeEvent } from "@/lib/theme";
import styles from "./spotlight-cursor.module.css";

interface SpotlightConfig {
  radius?: number;
  brightness?: number;
  color?: string;
  smoothing?: number;
}

type SpotlightCursorProps = CanvasHTMLAttributes<HTMLCanvasElement> & {
  config?: SpotlightConfig;
};

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(value)) return "255, 255, 255";
  const number = Number.parseInt(value, 16);
  return `${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}`;
}

export function SpotlightCursor({ config, className = "", ...props }: SpotlightCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radius = Math.min(500, Math.max(40, config?.radius ?? 200));
  const brightness = Math.min(0.35, Math.max(0, config?.brightness ?? 0.15));
  const smoothing = Math.min(1, Math.max(0.05, config?.smoothing ?? 0.18));
  const color = config?.color;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const desktop = matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const highContrast = matchMedia("(forced-colors: active)");
    let frame = 0;
    let targetX = -1;
    let targetY = -1;
    let currentX = -1;
    let currentY = -1;

    const enabled = () =>
      desktop.matches && !reduced.matches && !highContrast.matches && !document.hidden &&
      document.documentElement.dataset.motion === "full" &&
      document.documentElement.dataset.graphics !== "low";

    const draw = () => {
      frame = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (!enabled() || targetX < 0) return;

      if (currentX < 0) {
        currentX = targetX;
        currentY = targetY;
      } else {
        currentX += (targetX - currentX) * smoothing;
        currentY += (targetY - currentY) * smoothing;
      }

      const dark = document.documentElement.dataset.theme === "dark";
      const rgb = hexToRgb(color ?? (dark ? "#ffffff" : "#6e626a"));
      const gradient = context.createRadialGradient(currentX, currentY, 0, currentX, currentY, radius);
      gradient.addColorStop(0, `rgba(${rgb}, ${dark ? brightness : brightness * 0.7})`);
      gradient.addColorStop(1, `rgba(${rgb}, 0)`);
      context.fillStyle = gradient;
      context.fillRect(currentX - radius, currentY - radius, radius * 2, radius * 2);

      if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const scheduleDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const hide = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      targetX = -1;
      targetY = -1;
      currentX = -1;
      currentY = -1;
      canvas.dataset.visible = "false";
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const resize = () => {
      if (!enabled()) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      scheduleDraw();
    };

    const updatePolicy = () => {
      if (!enabled()) hide();
      else resize();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled() || event.pointerType !== "mouse" ||
          (event.target instanceof Element && event.target.closest("dialog[open]"))) {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      canvas.dataset.visible = "true";
      scheduleDraw();
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };

    updatePolicy();
    window.addEventListener("resize", resize);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", hide);
    window.addEventListener("portfolio-motion-change", updatePolicy);
    window.addEventListener(preferencesChangeEvent, updatePolicy);
    window.addEventListener(themeChangeEvent, scheduleDraw);
    document.addEventListener("visibilitychange", updatePolicy);
    desktop.addEventListener("change", updatePolicy);
    reduced.addEventListener("change", updatePolicy);
    highContrast.addEventListener("change", updatePolicy);

    return () => {
      hide();
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", hide);
      window.removeEventListener("portfolio-motion-change", updatePolicy);
      window.removeEventListener(preferencesChangeEvent, updatePolicy);
      window.removeEventListener(themeChangeEvent, scheduleDraw);
      document.removeEventListener("visibilitychange", updatePolicy);
      desktop.removeEventListener("change", updatePolicy);
      reduced.removeEventListener("change", updatePolicy);
      highContrast.removeEventListener("change", updatePolicy);
    };
  }, [radius, brightness, color, smoothing]);

  return <canvas {...props} ref={canvasRef} className={`${styles.spotlight} ${className}`.trim()} data-visible="false" aria-hidden="true" />;
}
