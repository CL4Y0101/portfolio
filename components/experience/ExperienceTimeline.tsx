"use client";

import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Experience } from "@/lib/types";

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    setActiveId(items[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="experience-explorer" data-scroll-reveal>
      <div className="experience-timeline" role="tablist" aria-label="Experience timeline" aria-orientation="vertical">
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
            onClick={() => setActiveId(item.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            <span className="experience-line" aria-hidden="true"><i /></span>
            <span className="experience-tab-copy">
              <small>{item.period}</small>
              <strong>{item.organization}</strong>
              <span>{item.role}</span>
            </span>
            {item.featured ? <em>{item.statusLabel}</em> : null}
          </button>
        ))}
      </div>

      <div className="experience-detail-panels">
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
                <p className="eyebrow">Selected experience</p>
                <h3>{item.role}</h3>
                <strong>{item.organization}</strong>
              </div>
              <BriefcaseBusiness aria-hidden="true" size={24} />
            </div>
            <p className="experience-location">{item.period} · {item.location}</p>
            <p className="experience-summary">{item.summary}</p>
            <ul className="evidence-list">
              {item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
            </ul>
            <div className="experience-technologies">
              <span>Technologies & areas</span>
              <ul className="skill-list">
                {item.technologies.map((technology) => <li key={technology}>{technology}</li>)}
              </ul>
            </div>
            {item.projectSlug ? (
              <Link className="text-link" href={`/projects/${item.projectSlug}`} prefetch={false}>
                View related case study <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
