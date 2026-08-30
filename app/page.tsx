import { About } from "@/components/sections/About";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { OpenSource } from "@/components/sections/OpenSource";
import { Skills } from "@/components/sections/Skills";

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <FeaturedProjects />
      <Experience />
      <Skills />
      <About />
      <Achievements />
      <OpenSource />
      <Contact />
    </main>
  );
}
