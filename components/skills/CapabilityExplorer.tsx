"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { projects } from "@/data/projects";
import type { SkillGroup } from "@/lib/types";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { useLanguage } from "@/components/ui/useLanguage";

export function CapabilityExplorer({ groups }: { groups: SkillGroup[] }) {
  const [activeId, setActiveId] = useState(groups[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const language = useLanguage();

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % groups.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + groups.length) % groups.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = groups.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    setActiveId(groups[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="capability-explorer" data-scroll-reveal>
      <div className="capability-tabs" role="tablist" aria-label={language === "id" ? "Kategori keahlian teknis" : "Technical capability categories"} aria-orientation="vertical">
        {groups.map((group, index) => (
          <button
            key={group.id}
            ref={(element) => { tabRefs.current[index] = element; }}
            id={`capability-tab-${group.id}`}
            type="button"
            role="tab"
            aria-selected={activeId === group.id}
            aria-controls={`capability-panel-${group.id}`}
            tabIndex={activeId === group.id ? 0 : -1}
            onClick={() => setActiveId(group.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <LocalizedText en={group.title} />
          </button>
        ))}
      </div>

      <div className="capability-panels">
        {groups.map((group) => {
          const primary = group.skills.filter((skill) => skill.emphasis === "primary");
          const exploring = group.skills.filter((skill) => skill.emphasis === "exploring");
          const supporting = group.skills.filter((skill) => skill.emphasis !== "primary" && skill.emphasis !== "exploring");
          const appliedProjects = projects.filter((project) => group.appliedProjectSlugs.includes(project.slug));

          return (
            <section
              key={group.id}
              id={`capability-panel-${group.id}`}
              role="tabpanel"
              aria-labelledby={`capability-tab-${group.id}`}
              hidden={activeId !== group.id}
              tabIndex={0}
            >
              <p className="eyebrow"><LocalizedText en="Capability detail" /></p>
              <h3><LocalizedText en={group.title} /></h3>
              <p className="capability-description"><LocalizedText en={group.description} /></p>

              <div className="capability-skill-groups">
                {primary.length ? <SkillList label="Primary" skills={primary.map((skill) => skill.name)} /> : null}
                {!primary.length && exploring.length ? <SkillList label="Exploring" skills={exploring.map((skill) => skill.name)} /> : null}
                {supporting.length || (primary.length && exploring.length) ? (
                  <details className="capability-more-tools">
                    <summary><LocalizedText en="More tools" /></summary>
                    {supporting.length ? <SkillList label="Supporting" skills={supporting.map((skill) => skill.name)} /> : null}
                    {primary.length && exploring.length ? <SkillList label="Exploring" skills={exploring.map((skill) => skill.name)} /> : null}
                  </details>
                ) : null}
              </div>

              <div className="capability-projects">
                <span><LocalizedText en="Applied in" /></span>
                <div>
                  {appliedProjects.map((project) => (
                    <Link key={project.slug} href={`/projects/${project.slug}`} prefetch={false}>{project.title}</Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SkillList({ label, skills }: { label: string; skills: string[] }) {
  return (
    <div>
      <span><LocalizedText en={label} /></span>
      <ul className="skill-list" aria-label={`${label} technologies`}>
        {skills.map((skill) => <li key={skill}><LocalizedText en={skill} /></li>)}
      </ul>
    </div>
  );
}
