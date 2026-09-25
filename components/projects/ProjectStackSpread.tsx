"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { useScrollProgress } from "@/components/motion/useScrollProgress";
import { ProjectStoryPanel } from "./ProjectStoryPanel";
import type { Project } from "@/lib/types";
import styles from "./project-stack-spread.module.css";

export function ProjectStackSpread({ projects, onBrowse }: { projects: Project[]; onBrowse: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const selected = projects.slice(0, 4);
  const scroll = useScrollProgress(wrapRef, { stageSelector: `.${styles.stage}`, onProgress: ({ progress, enabled, width }) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const spread = Math.min(1, progress / 0.2);
    const questProgress = Math.max(0, (progress - 0.24) / 0.7);
    const focused = document.activeElement?.closest<HTMLElement>("[data-quest]");
    const index = focused && wrap.contains(focused) ? Number(focused.dataset.quest)
      : Math.min(selected.length - 1, Math.floor(questProgress * selected.length));
    if (enabled && index !== activeRef.current) { activeRef.current = index; setActive(index); }
    const story = progress >= 0.24 || Boolean(focused && wrap.contains(focused));
    wrap.dataset.phase = story ? "quest" : "discover";
    wrap.style.setProperty("--spread-progress", String(progress));
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - (selected.length - 1) / 2;
      const x = story ? -width * 0.235 + (i - index) * 14 : offset * Math.min(width * 0.23, 270) * spread;
      const y = story ? (i - index) * 10 : (i % 2 ? 18 : -18) * spread;
      card.style.transform = enabled ? `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${story && i === index ? 0 : (i % 2 ? 5 : -5) * (1 - spread * 0.65)}deg)` : "";
      card.style.opacity = story && i !== index ? "0.15" : "1";
      card.style.zIndex = String(story && i === index ? 8 : i + 1);
    });
  } });

  function selectQuest(index: number) {
    activeRef.current = index;
    setActive(index);
    const frame = scroll.current;
    if (frame.enabled) window.scrollTo({ top: frame.start + frame.travel * (0.24 + (index + 0.3) / selected.length * 0.7), behavior: "instant" });
  }

  return (
    <div ref={wrapRef} className={styles.wrap} data-project-story data-phase="discover">
      <div className={styles.stage}>
        <div className={styles.heading}>
          <span>01 / <LocalizedText en="Discover builds" id="Jelajahi karya" /></span>
          <h3><LocalizedText en="Explore the builds" /></h3>
        </div>
        <div className={styles.spread} aria-hidden="true">
          {selected.map((project, index) => {
            const screenshot = project.screenshots[0];
            return screenshot ? <div key={project.slug} ref={(element) => { cardsRef.current[index] = element; }} className={styles.card}>
              <Image src={screenshot.src} alt="" width={720} height={450} sizes="(max-width: 1200px) 30vw, 380px" />
              <span>{project.title}</span>
            </div> : null;
          })}
        </div>
        <div className={styles.quests}>
          {selected.map((project, index) => <ProjectStoryPanel key={project.slug} project={project} index={index} active={index === active} />)}
        </div>
        <div className={styles.controls}>
          <div className={styles.steps} role="group" aria-label="Project quests">
            {selected.map((project, index) => <button key={project.slug} type="button" aria-label={project.title} aria-pressed={active === index} onClick={() => selectQuest(index)}>{String(index + 1).padStart(2, "0")}</button>)}
          </div>
          <button className="text-link" type="button" onClick={onBrowse} aria-controls="project-gallery"><LocalizedText en="View all builds" id="Lihat semua karya" /> <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </div>
  );
}
