import type { Metadata } from "next";
import { EntryFocus } from "@/components/game-menu/EntryFocus";
import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { OpenSource } from "@/components/sections/OpenSource";
import { Skills } from "@/components/sections/Skills";
import { MinecraftRidges } from "@/components/ui/minecraft-ridges";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected work, experience, and skills of Aditya Fadni Athaullah: production web development, backend systems, cloud infrastructure, and practical software products.",
  alternates: { canonical: `${SITE_URL}/portfolio` },
};

export default function PortfolioPage() {
  return (
    <main id="main-content" className="portfolio-story">
      <EntryFocus />
      <MinecraftRidges />
      <Hero />
      <FeaturedProjects />
      <Experience />
      <Skills />
      <Achievements />
      <About />
      <OpenSource />
      <Contact />
    </main>
  );
}
