"use client";

import { useEffect, useState } from "react";

export type CaseStudySection = { id: string; label: string };

export function CaseStudyNavigation({ sections }: { sections: CaseStudySection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -62%", threshold: [0, 0.1, 0.5, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="case-study-navigation" aria-label="Case study sections">
      <div className="shell">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeId === section.id ? "location" : undefined}
            onClick={() => setActiveId(section.id)}
          >
            {section.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
