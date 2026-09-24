"use client";

import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Experience } from "@/lib/types";
import { LocalizedText } from "@/components/ui/LocalizedText";
import styles from "./experience-story.module.css";
import { useLanguage } from "@/components/ui/useLanguage";

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const storyRef = useRef<HTMLDivElement>(null);
  const language = useLanguage();

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    const stage = story.querySelector<HTMLElement>(`.${styles.stage}`);
    if (!stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 700px), (max-height: 760px)");
    let frame = 0;
    let watching = false;

    const update = () => {
      frame = 0;
      if (reduced.matches || compact.matches || document.documentElement.dataset.motion !== "full") {
        story.style.setProperty("--journey-progress", "100%");
        return;
      }
      const bounds = story.getBoundingClientRect();
      const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0;
      const distance = Math.max(1, story.offsetHeight - stage.offsetHeight);
      const progress = Math.min(1, Math.max(0, (stickyTop - bounds.top) / distance));
      story.style.setProperty("--journey-progress", `${Math.round(progress * 100)}%`);
      const step = Math.min(items.length - 1, Math.floor(progress * items.length));
      if (items[step]) setActiveId(items[step].id);
    };
    const queueUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !watching) {
        window.addEventListener("scroll", queueUpdate, { passive: true });
        watching = true;
      } else if (!entry.isIntersecting && watching) {
        window.removeEventListener("scroll", queueUpdate);
        watching = false;
      }
      queueUpdate();
    }, { rootMargin: "160px 0px" });
    observer.observe(story);
    reduced.addEventListener("change", queueUpdate);
    compact.addEventListener("change", queueUpdate);
    window.addEventListener("portfolio-motion-change", queueUpdate);
    window.addEventListener("resize", queueUpdate);
    queueUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      window.removeEventListener("portfolio-motion-change", queueUpdate);
      reduced.removeEventListener("change", queueUpdate);
      compact.removeEventListener("change", queueUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, [items]);

  function selectItem(index: number) {
    setActiveId(items[index].id);
    const story = storyRef.current;
    const stage = story?.querySelector<HTMLElement>(`.${styles.stage}`);
    if (!story || !stage || window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 700px), (max-height: 760px)").matches || document.documentElement.dataset.motion !== "full") return;

    const stickyTop = Number.parseFloat(window.getComputedStyle(stage).top) || 0;
    const distance = Math.max(1, story.offsetHeight - stage.offsetHeight);
    const storyTop = window.scrollY + story.getBoundingClientRect().top;
    window.scrollTo({ top: storyTop - stickyTop + distance * ((index + 0.1) / items.length), behavior: "instant" });
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectItem(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div ref={storyRef} className={`experience-explorer ${styles.story}`} style={{ "--story-height": `${items.length * 85 + 70}vh` } as CSSProperties}>
      <div className={styles.stage}>
        <div className={`experience-timeline ${styles.track}`} role="tablist" aria-label={language === "id" ? "Linimasa pengalaman" : "Experience timeline"}>
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`experience-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={activeId === item.id}
              aria-controls={`experience-panel-${item.id}`}
              tabIndex={activeId === item.id ? 0 : -1}
              onClick={() => selectItem(index)}
              onKeyDown={(event) => handleTabKey(event, index)}
            >
              <span className="experience-line" aria-hidden="true"><i /></span>
              <span className="experience-tab-copy">
                <small><LocalizedText en={item.period} /></small>
                <strong>{item.organization}</strong>
                <span><LocalizedText en={item.role} /></span>
              </span>
              {item.featured && item.statusLabel ? <em><LocalizedText en={item.statusLabel} /></em> : null}
            </button>
          ))}
        </div>

        <div className={`experience-detail-panels ${styles.details}`}>
          {items.map((item) => (
            <article
              key={item.id}
              id={`experience-panel-${item.id}`}
              role="tabpanel"
              aria-labelledby={`experience-tab-${item.id}`}
              hidden={activeId !== item.id}
              tabIndex={0}
            >
              <div className="experience-detail-heading">
                <div>
                  <p className="eyebrow"><LocalizedText en="Selected experience" /></p>
                  <h3><LocalizedText en={item.role} /></h3>
                  <strong>{item.organization}</strong>
                </div>
                <BriefcaseBusiness aria-hidden="true" size={24} />
              </div>
              <p className="experience-location"><LocalizedText en={item.period} /> · <LocalizedText en={item.location} /></p>
              <p className="experience-summary"><LocalizedText en={item.summary} /></p>
              <details className={styles.responsibilities}>
                <summary><LocalizedText en="Work details" /></summary>
                <ul className="evidence-list">
                  {item.responsibilities.map((responsibility) => <li key={responsibility}><LocalizedText en={responsibility} /></li>)}
                </ul>
              </details>
              <div className="experience-technologies">
                <span><LocalizedText en="Technologies & areas" /></span>
                <ul className="skill-list">
                  {item.technologies.map((technology) => <li key={technology}><LocalizedText en={technology} /></li>)}
                </ul>
              </div>
              {item.projectSlug ? (
                <Link className="text-link" href={`/projects/${item.projectSlug}`} prefetch={false}>
                  <LocalizedText en="View related case study" /> <ArrowUpRight aria-hidden="true" size={16} />
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
