"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { LocalizedText } from "@/components/ui/LocalizedText";
import type { Project } from "@/lib/types";
import styles from "./project-stack-spread.module.css";

export function ProjectStackSpread({ projects }: { projects: Project[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const stage = wrap.querySelector<HTMLElement>(`.${styles.stage}`);
    const cards = Array.from(wrap.querySelectorAll<HTMLElement>(`.${styles.card}`));
    if (!stage || !cards.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 700px)");
    let frame = 0;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frame = 0;
      if (reduced.matches || mobile.matches || document.documentElement.dataset.motion !== "full") return;
      const rect = wrap.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight * 0.35);
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - rect.top) / travel));
      const step = Math.min(stage.clientWidth * 0.265, 335);
      const startX = [-24, -8, 12, 26];
      const startY = [-13, 10, -8, 14];
      const endY = [-22, 19, -19, 22];
      const rotation = [-7, 4, -4, 7];

      cards.forEach((card, index) => {
        const x = startX[index] * (1 - progress) + (index - 1.5) * step * progress + pointerX * progress * (index + 1) * 2;
        const y = startY[index] * (1 - progress) + endY[index] * progress + pointerY * progress * (index + 1) * 1.5;
        const angle = rotation[index] * (1 - progress) + rotation[index] * 0.3 * progress;
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${angle}deg)`;
      });
      wrap.style.setProperty("--spread-progress", String(progress));
    };
    const queueUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      queueUpdate();
    };
    const onPointerLeave = () => { pointerX = 0; pointerY = 0; queueUpdate(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        window.addEventListener("scroll", queueUpdate, { passive: true });
        stage.addEventListener("pointermove", onPointerMove, { passive: true });
        stage.addEventListener("pointerleave", onPointerLeave);
        visible = true;
      } else if (!entry.isIntersecting && visible) {
        window.removeEventListener("scroll", queueUpdate);
        stage.removeEventListener("pointermove", onPointerMove);
        stage.removeEventListener("pointerleave", onPointerLeave);
        visible = false;
      }
      queueUpdate();
    }, { rootMargin: "160px 0px" });
    observer.observe(wrap);
    window.addEventListener("resize", queueUpdate);
    window.addEventListener("portfolio-motion-change", queueUpdate);
    reduced.addEventListener("change", queueUpdate);
    mobile.addEventListener("change", queueUpdate);
    queueUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      window.removeEventListener("portfolio-motion-change", queueUpdate);
      reduced.removeEventListener("change", queueUpdate);
      mobile.removeEventListener("change", queueUpdate);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.wrap} aria-label="Project previews">
      <div className={styles.stage}>
        <div className={styles.heading}>
          <span>01 / 04</span>
          <strong><LocalizedText en="Explore the builds" /></strong>
        </div>
        {projects.slice(0, 4).map((project, index) => {
          const screenshot = project.screenshots[0];
          if (!screenshot) return null;
          return (
            <Link key={project.slug} className={styles.card} href={`/projects/${project.slug}`} prefetch={false} style={{ zIndex: index + 1 }} aria-label={`Explore ${project.title}`}>
              <Image src={screenshot.src} alt={screenshot.alt} width={720} height={450} sizes="(max-width: 1200px) 25vw, 320px" />
              <span>{project.title}</span>
            </Link>
          );
        })}
        <span className={styles.hint}><LocalizedText en="Scroll to spread" /> ↓</span>
      </div>
    </div>
  );
}
