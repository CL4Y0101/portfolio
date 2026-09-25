"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/components/motion/useScrollProgress";

export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  useScrollProgress(ref, { closest: "main", onProgress: ({ progress }) => {
    if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
  } });

  return (
    <div ref={ref} className="reading-progress" aria-hidden="true">
      <span ref={bar} style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
