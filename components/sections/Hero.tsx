import { ArrowDownRight, Download, MapPin } from "lucide-react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { HeroMotion } from "@/components/motion/HeroMotion";
import { RevealText } from "@/components/ui/RevealText";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { CvDownloadLink } from "@/components/ui/CvDownloadLink";

export function Hero() {
  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title" data-world-entry>
      <HeroMotion />
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-entry hero-entry-1"><LocalizedText en={profile.eyebrow} /></p>
          <RevealText as="h1" id="hero-title" text={profile.name} mode="entrance" delay={110} />
          <RevealText as="p" className="hero-statement" text={profile.headline} mode="entrance" delay={210} stagger={36} />
          <p className="hero-intro hero-entry hero-entry-4"><LocalizedText en={profile.introduction} /></p>

          <div className="hero-actions hero-entry hero-entry-5">
            <Button href="/#work">
              <LocalizedText en="View selected work" /> <ArrowDownRight aria-hidden="true" size={17} />
            </Button>
            <CvDownloadLink className="button button-secondary">
              <LocalizedText en="Download CV" /> <Download aria-hidden="true" size={17} />
            </CvDownloadLink>
          </div>

          <div className="hero-location hero-entry hero-entry-6">
            <MapPin aria-hidden="true" size={16} />
            <span>{profile.location}</span>
            <span className="hero-location-divider" aria-hidden="true" />
            <span><LocalizedText en="Working remotely across product and infrastructure" /></span>
          </div>
        </div>

        <aside className="hero-profile hero-entry hero-entry-portrait" aria-label="Aditya's current focus">
          <div className="portrait-frame">
            <Image
              src={profile.profileImage}
              alt="Voxel-style portrait of Aditya Fadni Athaullah"
              width={1280}
              height={1280}
              priority
              sizes="(max-width: 900px) 70vw, 390px"
            />
          </div>
          <div className="focus-card">
            <span className="focus-index"><LocalizedText en="Current focus / 2026" /></span>
            <strong>KandU Campus Platform</strong>
            <p>Next.js · Firebase · Linux deployment</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
