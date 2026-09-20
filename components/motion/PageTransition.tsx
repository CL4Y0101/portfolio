"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motionDurations } from "@/components/motion/motion";

type TransitionPhase = "idle" | "cover" | "reveal";

export function PageTransition() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const coverStartedAt = useRef(0);
  const [phase, setPhase] = useState<TransitionPhase>("idle");

  useEffect(() => {
    let fallbackTimer = 0;

    const handleNavigationIntent = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      const link = target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target || link.hasAttribute("download")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;

      coverStartedAt.current = performance.now();
      setPhase("cover");
      window.clearTimeout(fallbackTimer);
      fallbackTimer = window.setTimeout(() => setPhase("idle"), 1200);
    };

    document.addEventListener("click", handleNavigationIntent, true);
    return () => {
      document.removeEventListener("click", handleNavigationIntent, true);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    let focusTimer = 0;
    const elapsedCoverTime = coverStartedAt.current ? performance.now() - coverStartedAt.current : motionDurations.fast;
    const revealDelay = Math.max(0, motionDurations.fast - elapsedCoverTime);
    const revealTimer = window.setTimeout(() => setPhase("reveal"), revealDelay);
    const idleTimer = window.setTimeout(() => setPhase("idle"), revealDelay + motionDurations.page);

    focusTimer = window.setTimeout(() => {
      const heading = document.querySelector<HTMLElement>("main h1");
      const target = heading ?? document.querySelector<HTMLElement>("main");
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }, 80);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(idleTimer);
      window.clearTimeout(focusTimer);
    };
  }, [pathname]);

  return (
    <div className="route-transition" data-state={phase} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span className="route-transition-label">Loading region</span>
    </div>
  );
}
