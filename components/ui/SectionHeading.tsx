import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/ui/RevealText";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  titleId?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  titleId,
}: SectionHeadingProps) {
  return (
    <Reveal variant="block-wipe" className={`section-heading ${align === "center" ? "section-heading-centered" : ""}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <RevealText as="h2" id={titleId} text={title} />
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </Reveal>
  );
}
