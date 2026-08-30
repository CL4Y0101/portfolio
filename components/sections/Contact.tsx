import { ArrowUpRight, ContactRound, Download, GitFork, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { CopyButton } from "@/components/ui/CopyButton";

const contactLinks = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: "GitHub", value: "github.com/CL4Y0101", href: profile.github, icon: GitFork },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/aditya-fadni-312373308",
    href: profile.linkedin,
    icon: ContactRound,
  },
  { label: "CV", value: "Download PDF", href: profile.cv, icon: Download, download: true },
];

export function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="shell contact-grid">
        <div data-scroll-reveal>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Let’s talk about practical software work.</h2>
          <p>
            For product development, web systems, or engineering collaboration, email is the most direct way to reach me.
          </p>
        </div>
        <div className="contact-links" data-scroll-reveal>
          {contactLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                download={item.download || undefined}
              >
                <Icon aria-hidden="true" size={21} />
                <span>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                </span>
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
            );
          })}
          <div className="contact-copy">
            <CopyButton value={profile.email} label="Copy email" />
          </div>
        </div>
      </div>
    </section>
  );
}
