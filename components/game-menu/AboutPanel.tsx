import { ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { GameMenuButton } from "@/components/game-menu/GameMenuButton";
import { GlassPanel } from "@/components/game-ui/GlassPanel";
import ui from "@/components/game-ui/minecraft.module.css";
import { LocalizedText } from "@/components/ui/LocalizedText";

export function AboutPanel({ onBack, onEnter }: { onBack: () => void; onEnter: () => void }) {
  return (
    <GlassPanel className="game-panel about-menu-panel" aria-labelledby="menu-about-title">
      <div className={`game-panel-heading ${ui.heading}`}>
        <div>
          <p><LocalizedText en="Player profile" /></p>
          <h2 id="menu-about-title"><LocalizedText en="About" /></h2>
        </div>
        <span>PROFILE / 2026</span>
      </div>

      <div className="menu-about-grid">
        <div className="menu-profile-image">
          <Image src={profile.profileImage} alt={`Voxel-style portrait of ${profile.name}`} width={1280} height={1280} priority sizes="(max-width: 700px) 42vw, 260px" />
        </div>
        <div className="menu-profile-copy">
          <p className="menu-profile-role"><LocalizedText en="Software Developer · Informatics Engineering Student" /></p>
          <h3>{profile.name}</h3>
          <p><LocalizedText en={profile.supportingText} /></p>
          <dl>
            <div><dt><LocalizedText en="Education" /></dt><dd>{education[0]?.institution} · <LocalizedText en={education[0]?.program ?? ""} /></dd></div>
            <div><dt><LocalizedText en="Current focus" /></dt><dd>KandU Campus Platform · Next.js, Firebase, <LocalizedText en="and Linux deployment" /></dd></div>
            <div><dt><LocalizedText en="Location" /></dt><dd>{profile.location}</dd></div>
          </dl>
          <div className="menu-social-links">
            <a data-game-focusable href={`mailto:${profile.email}`}><Mail aria-hidden="true" size={15} /> Email</a>
            <a data-game-focusable href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight aria-hidden="true" size={14} /></a>
            <a data-game-focusable href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" size={14} /></a>
          </div>
        </div>
      </div>

      <div className="game-panel-actions">
        <GameMenuButton icon="arrow" onClick={onBack}><LocalizedText en="Back" /></GameMenuButton>
        <GameMenuButton icon="diamond" variant="primary" onClick={onEnter}><LocalizedText en="Enter portfolio" /></GameMenuButton>
      </div>
    </GlassPanel>
  );
}
