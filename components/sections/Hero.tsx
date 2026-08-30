import { ArrowDownRight, Download, MapPin } from "lucide-react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{profile.eyebrow}</p>
          <h1 id="hero-title">{profile.name}</h1>
          <p className="hero-statement">{profile.headline}</p>
          <p className="hero-intro">{profile.introduction}</p>

          <div className="hero-actions">
            <Button href="/#work">
              View selected work <ArrowDownRight aria-hidden="true" size={17} />
            </Button>
            <Button href={profile.cv} variant="secondary" download>
              Download CV <Download aria-hidden="true" size={17} />
            </Button>
          </div>

          <div className="hero-location">
            <MapPin aria-hidden="true" size={16} />
            <span>{profile.location}</span>
            <span className="hero-location-divider" aria-hidden="true" />
            <span>Working remotely across product and infrastructure</span>
          </div>
        </div>

        <aside className="hero-profile" aria-label="Aditya's current focus">
          <div className="portrait-frame">
            <Image
              src={profile.profileImage}
              alt="Aditya Fadni Athaullah"
              width={1280}
              height={1280}
              priority
              sizes="(max-width: 900px) 70vw, 390px"
            />
          </div>
          <div className="focus-card">
            <span className="focus-index">Current focus / 2026</span>
            <strong>KandU Campus Platform</strong>
            <p>Next.js · Firebase · Linux deployment</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
