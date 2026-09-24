import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { profile } from "@/data/profile";
import { LocalizedText } from "@/components/ui/LocalizedText";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="footer-name" href="/#home">
            {profile.name}
          </Link>
          <p><LocalizedText en="Software development, systems, and deployment." /></p>
        </div>
        <div className="footer-links" aria-label="Footer links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a href={`mailto:${profile.email}`}>Email</a>
        </div>
        <p className="footer-note">© {new Date().getFullYear()} · <LocalizedText en="Built with Next.js and exported statically." /></p>
      </div>
    </footer>
  );
}
