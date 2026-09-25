"use client";

import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { useScrollProgress } from "@/components/motion/useScrollProgress";
import type { Experience } from "@/lib/types";
import { LocalizedText } from "@/components/ui/LocalizedText";
import styles from "./experience-story.module.css";
import { useLanguage } from "@/components/ui/useLanguage";

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const storyRef = useRef<HTMLDivElement>(null);
  const language = useLanguage();

  const scroll = useScrollProgress(storyRef, { stageSelector: `.${styles.stage}`, onProgress: ({ progress, enabled }) => {
    const story = storyRef.current;
    if (!story) return;
    story.style.setProperty("--journey-progress", `${enabled ? Math.round(progress * 100) : 100}%`);
    if (!enabled || story.querySelector("details[open]") || (story.contains(document.activeElement) && document.activeElement?.closest('[role="tabpanel"]'))) return;
    const step = Math.min(items.length - 1, Math.floor(progress * items.length));
    if (items[step]) setActiveId(items[step].id);
  } });

  function selectItem(index: number) {
    setActiveId(items[index].id);
    const frame = scroll.current;
    if (frame.enabled) {
      window.scrollTo({ top: frame.start + frame.travel * ((index + 0.1) / items.length), behavior: "instant" });
    } else {
      document.getElementById(`experience-panel-${items[index].id}`)?.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
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
    <div ref={storyRef} className={`experience-explorer ${styles.story}`} data-journey-story>
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
              data-active={activeId === item.id}
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
