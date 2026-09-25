"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { LocalizedText } from "@/components/ui/LocalizedText";

/** A real credential, highlighted once per mount; no toast or repeated live announcement. */
export function Milestone({ children, featured }: { children: ReactNode; featured?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.discovered = "true";
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <article ref={ref} className={`story-milestone ${featured ? "achievement-featured" : ""}`}>
    {children}
    <small className="milestone-label"><LocalizedText en="Milestone discovered" id="Pencapaian ditemukan" /></small>
  </article>;
}
