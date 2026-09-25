"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { projects } from "@/data/projects";
import type { SkillGroup } from "@/lib/types";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { useLanguage } from "@/components/ui/useLanguage";
import { GameIcon, type GameIconName } from "@/components/game-ui/GameIcon";

const inventoryIcons: GameIconName[] = ["crafting-table", "chest", "compass", "redstone", "compass", "book", "redstone"];

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
    <div className="capability-explorer inventory-explorer" data-scroll-reveal>
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
            onFocus={() => setActiveId(group.id)}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse" && !event.currentTarget.closest(".capability-explorer")?.querySelector('[role="tabpanel"]:focus-within')) setActiveId(group.id);
            }}
            onKeyDown={(event) => handleTabKey(event, index)}
          >
            <GameIcon name={inventoryIcons[index] ?? "book"} />
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
        {skills.map((skill) => {
          const evidence = projects.filter((project) => project.technologies.some((technology) => technology.toLowerCase() === skill.toLowerCase()));
          return <li key={skill} className="inventory-item">
            <details onPointerEnter={(event) => { if (event.pointerType === "mouse") event.currentTarget.open = true; }}
              onPointerLeave={(event) => { if (!event.currentTarget.contains(document.activeElement)) event.currentTarget.open = false; }}>
              <summary onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) event.currentTarget.parentElement?.setAttribute("open", ""); }}><LocalizedText en={skill} /></summary>
              <div className="inventory-evidence">
                <strong><LocalizedText en={label} /></strong>
                {evidence.length ? <>
                  <span><LocalizedText en="Applied in" /></span>
                  {evidence.map((project) => <Link key={project.slug} href={`/projects/${project.slug}`} prefetch={false}>{project.title} ↗</Link>)}
                </> : <span><LocalizedText en="Part of this toolkit; no dedicated case study published." id="Bagian dari perangkat kerja ini; belum ada studi kasus khusus." /></span>}
              </div>
            </details>
          </li>;
        })}
      </ul>
    </div>
  );
}
