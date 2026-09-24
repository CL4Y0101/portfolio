import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/ui/RevealText";
import { LocalizedText } from "@/components/ui/LocalizedText";

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
        <p className="eyebrow"><LocalizedText en={eyebrow} /></p>
        <RevealText as="h2" id={titleId} text={title} />
        {description ? <p className="section-description"><LocalizedText en={description} /></p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </Reveal>
  );
}
