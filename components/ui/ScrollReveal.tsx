"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = "[data-scroll-reveal]";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    if (!elements.length) return;

    const start = () => {
      observer?.disconnect();
      root.classList.remove("scroll-reveal-ready");
      elements.forEach((element) => element.classList.remove("is-revealed"));

      if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-revealed"));
        return;
      }

      elements.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top <= window.innerHeight * 0.92 && bounds.bottom >= 0) {
          element.classList.add("is-revealed");
        }
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
      );

      elements.forEach((element) => {
        if (!element.classList.contains("is-revealed")) observer?.observe(element);
      });
      root.classList.add("scroll-reveal-ready");
    };

    const handleMotionPreference = () => start();
    start();
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionPreference);
      root.classList.remove("scroll-reveal-ready");
    };
  }, [pathname]);

  return null;
}
