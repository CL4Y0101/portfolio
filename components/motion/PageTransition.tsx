"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motionDurations } from "@/components/motion/motion";
import Image from "next/image";
import { projects } from "@/data/projects";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { useSharedProjectCover } from "./useSharedProjectCover";

type TransitionPhase = "idle" | "cover" | "reveal";

export function PageTransition() {
  const pathname = usePathname();
  const startSharedCover = useSharedProjectCover(pathname);
  const previousPathname = useRef(pathname);
  const coverStartedAt = useRef(0);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [destinationPath, setDestinationPath] = useState(pathname);
  const destinationProject = projects.find((project) => destinationPath.replace(/\/$/, "").endsWith(`/projects/${project.slug}`));

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
      startSharedCover(link);
      setDestinationPath(destination.pathname);
      setPhase("cover");
      window.clearTimeout(fallbackTimer);
      fallbackTimer = window.setTimeout(() => setPhase("idle"), 1200);
    };

    document.addEventListener("click", handleNavigationIntent, true);
    return () => {
      document.removeEventListener("click", handleNavigationIntent, true);
      window.clearTimeout(fallbackTimer);
    };
  }, [startSharedCover]);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    let focusTimer = 0;
    const elapsedCoverTime = coverStartedAt.current ? performance.now() - coverStartedAt.current : motionDurations.fast;
    const revealDelay = Math.max(0, motionDurations.fast - elapsedCoverTime);
    const revealTimer = window.setTimeout(() => {
      setDestinationPath(pathname);
      setPhase("reveal");
    }, revealDelay);
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
      <span className="route-transition-label">
        <LocalizedText en={destinationProject ? "Entering project" : "Returning to world"} id={destinationProject ? "Memasuki proyek" : "Kembali ke dunia"} />
        {destinationProject ? <strong>{destinationProject.title}</strong> : null}
      </span>
      {destinationProject?.screenshots[0] ? <div className="route-transition-cover">
        <Image src={destinationProject.screenshots[0].src} alt="" width={480} height={300} sizes="240px" />
      </div> : null}
    </div>
  );
}
