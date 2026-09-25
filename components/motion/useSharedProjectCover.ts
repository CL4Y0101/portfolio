"use client";

import { useCallback, useEffect, useRef } from "react";
import { projects } from "@/data/projects";
import { worldMotionEnabled } from "./scroll-progress";
import { motionDurations } from "./motion";

type Flight = { slug: string; source: HTMLImageElement; clone: HTMLImageElement; bounds: DOMRect; timer: number; animation?: Animation; target?: HTMLImageElement };

/** A DOM shared-cover transition that never takes ownership of navigation/history. */
export function useSharedProjectCover(pathname: string) {
  const flight = useRef<Flight | null>(null);
  const clear = useCallback(() => {
    const current = flight.current;
    if (!current) return;
    flight.current = null;
    clearTimeout(current.timer);
    current.animation?.cancel();
    current.clone.remove();
    current.target?.removeAttribute("data-cover-in-flight");
    current.target?.closest(".case-cover")?.removeAttribute("data-shared-cover-target");
    document.documentElement.removeAttribute("data-shared-cover");
  }, []);

  const start = useCallback((link: HTMLAnchorElement) => {
    clear();
    if (!worldMotionEnabled()) return;
    if (!("animate" in Element.prototype) || !("checkVisibility" in Element.prototype)) return;
    const slug = projects.find((project) => new URL(link.href).pathname.replace(/\/$/, "").endsWith(`/projects/${project.slug}`))?.slug;
    if (!slug) return;
    const candidates = [...document.querySelectorAll<HTMLImageElement>(`img[data-project-cover="${slug}"]`)];
    const source = candidates.find((img) => link.contains(img)) ?? candidates.find((img) => {
      const rect = img.getBoundingClientRect();
      return img.checkVisibility() && rect.width > 0 && rect.bottom > 0 && rect.top < innerHeight;
    });
    if (!source?.complete || !source.naturalWidth || !source.checkVisibility()) return;
    const bounds = source.getBoundingClientRect();
    if (!bounds.width || bounds.bottom <= 0 || bounds.top >= innerHeight) return;
    const clone = document.createElement("img");
    clone.src = source.currentSrc || source.src;
    clone.alt = "";
    clone.setAttribute("aria-hidden", "true");
    clone.className = "shared-project-cover";
    Object.assign(clone.style, { left: `${bounds.left}px`, top: `${bounds.top}px`, width: `${bounds.width}px`, height: `${bounds.height}px` });
    document.body.append(clone);
    document.documentElement.dataset.sharedCover = "pending";
    flight.current = { slug, source, clone, bounds, timer: window.setTimeout(clear, 1800) };
  }, [clear]);

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    const current = flight.current;
    if (!current) return;
    const animate = async () => {
      const target = document.querySelector<HTMLImageElement>(`.case-cover img[data-project-cover="${current.slug}"]`);
      if (!target || target === current.source) return clear();
      try { await target.decode(); } catch {
        if (flight.current === current) clear();
        return;
      }
      if (flight.current !== current) return;
      if (!worldMotionEnabled()) return clear();
      current.target = target;
      target.setAttribute("data-cover-in-flight", "true");
      target.closest(".case-cover")?.classList.add("is-revealed");
      target.closest(".case-cover")?.setAttribute("data-shared-cover-target", "true");
      const destination = target.getBoundingClientRect();
      if (!destination.width) return clear();
      document.documentElement.dataset.sharedCover = "animating";
      const transform = `translate(${destination.left - current.bounds.left}px, ${destination.top - current.bounds.top}px) scale(${destination.width / current.bounds.width}, ${destination.height / current.bounds.height})`;
      current.animation = current.clone.animate([{ transform: "none" }, { transform }], { duration: motionDurations.page, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" });
      current.animation.finished.then(() => { if (flight.current === current) clear(); }).catch(() => {});
    };
    // Let Next's commit and scroll restoration settle, without delaying the route.
    firstFrame = requestAnimationFrame(() => { secondFrame = requestAnimationFrame(() => { void animate(); }); });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      if (flight.current === current) clear();
    };
  }, [pathname, clear]);

  useEffect(() => {
    const policy = () => { if (!worldMotionEnabled()) clear(); };
    const visibility = () => { if (document.hidden) clear(); };
    window.addEventListener("resize", clear);
    window.addEventListener("portfolio-motion-change", policy);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("resize", clear);
      window.removeEventListener("portfolio-motion-change", policy);
      document.removeEventListener("visibilitychange", visibility);
      clear();
    };
  }, [clear]);
  return start;
}
