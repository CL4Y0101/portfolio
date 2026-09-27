"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { useScrollProgress } from "@/components/motion/useScrollProgress";
import { ProjectStoryPanel } from "./ProjectStoryPanel";
import type { Project } from "@/lib/types";
import styles from "./project-stack-spread.module.css";
import { projectWorld } from "@/lib/project-world";
import { WorldAtmosphere } from "@/components/motion/WorldAtmosphere";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const radians = (degrees: number) => degrees * Math.PI / 180;

type WheelMetrics = { ringRadius: number; drumRadius: number; bow: number; shift: number };
type WheelDrag = { pointerId: number; startY: number; startProgress: number; moved: boolean };

export function ProjectStackSpread({ projects, onBrowse }: { projects: Project[]; onBrowse: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const spreadRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const ringLabelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const metricsRef = useRef<WheelMetrics | null>(null);
  const dragRef = useRef<WheelDrag | null>(null);
  const suppressClickRef = useRef(false);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const selected = projects.slice(0, 4);
  const count = selected.length;

  const updateWheel = useCallback((progress: number, enabled: boolean) => {
    const metrics = metricsRef.current;
    if (!enabled || !metrics || !count) return;

    // The ring opens during the first part of the existing sticky scroll scene.
    // The remaining scroll distance turns one project at a time to the front.
    const morph = clamp((progress - 0.015) / 0.225, 0, 1);
    const drumPosition = clamp(((progress - 0.24) / 0.7) * count - 0.5, 0, count - 1);
    if (wheelRef.current) wheelRef.current.style.transform = `translateX(${-morph * metrics.shift}px) translateZ(${-morph * metrics.drumRadius}px)`;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const distance = index - drumPosition;
      const angle = distance * 40;
      const bow = -metrics.bow * (1 - Math.cos(radians(angle)));
      card.style.transform = `translateX(${morph * bow}px) rotateZ(${(1 - morph) * index * 360 / count}deg) translateY(${-(1 - morph) * metrics.ringRadius}px) rotateX(${morph * angle}deg) translateZ(${morph * metrics.drumRadius}px)`;
      const visible = morph <= 0.5 || Math.abs(distance) <= 1.6 || document.activeElement === card;
      card.style.opacity = visible ? "1" : "0";
      card.style.visibility = visible ? "visible" : "hidden";
      card.style.zIndex = String(Math.round(100 - Math.abs(distance) * 2));
      const face = card.firstElementChild as HTMLElement | null;
      if (face) face.style.transform = `scale(${0.56 + morph * 0.44})`;
    });

    if (ringLabelRef.current) ringLabelRef.current.style.opacity = String(1 - morph);
  }, [count]);

  const scroll = useScrollProgress(wrapRef, { stageSelector: `.${styles.stage}`, onProgress: ({ progress, enabled }) => {
    const wrap = wrapRef.current;
    if (!wrap || !count) return;
    const questProgress = Math.max(0, (progress - 0.24) / 0.7);
    const focused = document.activeElement?.closest<HTMLElement>("[data-quest]");
    const index = focused && wrap.contains(focused) ? Number(focused.dataset.quest)
      : Math.min(count - 1, Math.floor(questProgress * count));
    if (enabled && index !== activeRef.current) { activeRef.current = index; setActive(index); }
    wrap.dataset.phase = progress >= 0.24 || Boolean(focused && wrap.contains(focused)) ? "quest" : "discover";
    wrap.style.setProperty("--spread-progress", String(progress));
    updateWheel(progress, enabled);
  } });

  useEffect(() => {
    const spread = spreadRef.current;
    if (!spread) return;
    const measure = () => {
      const card = cardsRef.current[0];
      if (!card || !spread.clientWidth || !spread.clientHeight) return;
      const cardHeight = card.offsetHeight;
      metricsRef.current = {
        ringRadius: Math.max(72, Math.min(cardHeight * 1.05, (spread.clientHeight - cardHeight * 0.56) / 2 - 8)),
        drumRadius: cardHeight * 2.1,
        bow: cardHeight * 1.5,
        shift: spread.clientWidth * 0.25,
      };
      spread.style.perspective = `${cardHeight * 2.7}px`;
      updateWheel(scroll.current.progress, scroll.current.enabled);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(spread);
    if (cardsRef.current[0]) observer.observe(cardsRef.current[0]);
    measure();
    return () => observer.disconnect();
  }, [scroll, updateWheel]);

  function selectQuest(index: number) {
    activeRef.current = index;
    setActive(index);
    const frame = scroll.current;
    if (frame.enabled) window.scrollTo({ top: frame.start + frame.travel * (0.24 + (index + 0.5) / count * 0.7), behavior: "instant" });
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>, settle: boolean) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.removeAttribute("data-dragging");
    suppressClickRef.current = true;
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    if (!settle) return;
    const frame = scroll.current;
    if (frame.progress < 0.24) {
      const destination = frame.progress < 0.12 ? 0 : 0.24 + 0.35 / count;
      window.scrollTo({ top: frame.start + frame.travel * destination, behavior: "instant" });
    } else {
      selectQuest(clamp(Math.floor((frame.progress - 0.24) / 0.7 * count), 0, count - 1));
    }
  }

  function handleWheelKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const focused = (event.target as HTMLElement).closest<HTMLElement>("[data-wheel-card]");
    const current = focused ? Number(focused.dataset.wheelCard) : activeRef.current;
    const next = clamp(current + (event.key === "ArrowDown" ? 1 : -1), 0, count - 1);
    selectQuest(next);
    window.requestAnimationFrame(() => cardsRef.current[next]?.focus({ preventScroll: true }));
  }

  return (
    <div ref={wrapRef} className={styles.wrap} data-project-story data-phase="discover" data-project-world={selected[active] ? projectWorld(selected[active]) : "neutral"}>
      <div className={styles.stage}>
        <WorldAtmosphere />
        <div className={styles.heading}>
          <span>01 / <LocalizedText en="Discover builds" id="Jelajahi karya" /></span>
          <h3><LocalizedText en="Explore the builds" /></h3>
        </div>
        <div ref={spreadRef} className={styles.spread}
          onPointerDown={(event) => {
            if (event.pointerType === "touch" || event.button !== 0 || !scroll.current.enabled) return;
            dragRef.current = { pointerId: event.pointerId, startY: event.clientY, startProgress: scroll.current.progress, moved: false };
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            if (!drag || drag.pointerId !== event.pointerId || event.buttons !== 1) return;
            const distance = drag.startY - event.clientY;
            if (!drag.moved && Math.abs(distance) < 6) return;
            if (!drag.moved) {
              drag.moved = true;
              event.currentTarget.setPointerCapture(event.pointerId);
              event.currentTarget.dataset.dragging = "true";
            }
            const frame = scroll.current;
            const progress = clamp(drag.startProgress + distance / 420 * 0.2, 0, 1);
            window.scrollTo({ top: frame.start + frame.travel * progress, behavior: "instant" });
            event.preventDefault();
          }}
          onPointerUp={(event) => finishDrag(event, true)}
          onPointerCancel={(event) => finishDrag(event, false)}
          onClickCapture={(event) => {
            if (!suppressClickRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressClickRef.current = false;
          }}
          onKeyDown={handleWheelKey}>
          <div ref={wheelRef} className={styles.wheel}>
            {selected.map((project, index) => {
              const screenshot = project.screenshots[0];
              return screenshot ? <Link key={project.slug} href={`/projects/${project.slug}`} prefetch={false}
                draggable={false}
                data-wheel-card={index} data-project-world={projectWorld(project)}
                aria-current={active === index ? "true" : undefined}
                ref={(element) => { cardsRef.current[index] = element; }}
                className={styles.card}
                style={{ "--ring-angle": `${index * 360 / count}deg` } as CSSProperties}>
                <span className={styles.cardFace}>
                  <Image data-project-cover={project.slug} src={screenshot.src} alt="" width={720} height={450} sizes="(max-width: 1200px) 30vw, 340px" draggable={false} />
                  <span className={styles.cardTitle}>{project.title}</span>
                  <span className="sr-only"><LocalizedText en="View case study" /></span>
                </span>
              </Link> : null;
            })}
          </div>
          <div ref={ringLabelRef} className={styles.ringLabel} aria-hidden="true">
            <span><LocalizedText en="Selected builds" id="Karya pilihan" /></span>
            <strong>{String(count).padStart(2, "0")}</strong>
          </div>
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
