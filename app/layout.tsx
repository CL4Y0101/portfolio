import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MainMenuScreen } from "@/components/game-menu/MainMenuScreen";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LocalizedText } from "@/components/ui/LocalizedText";
import { LiquidGlassCursor } from "@/components/ui/LiquidGlassCursor";
import { profile } from "@/data/profile";
import { SITE_URL, withBasePath } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aditya Fadni Athaullah | Software Developer Portfolio",
    template: "%s | Aditya Fadni Athaullah",
  },
  description:
    "Portfolio of Aditya Fadni Athaullah, an Informatics Engineering student and software developer working with Next.js, backend systems, Firebase, cloud infrastructure, networking, and production web applications.",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${profile.name} Portfolio`,
    title: "Aditya Fadni Athaullah | Software Developer Portfolio",
    description:
      "Production web development, backend systems, cloud infrastructure, and practical software products.",
    images: [
      {
        url: "/images/projects/kandu-production.png",
        width: 1440,
        height: 1000,
        alt: "KandU Campus Platform, selected work by Aditya Fadni Athaullah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Fadni Athaullah | Software Developer Portfolio",
    description: "Production web development, backend systems, cloud infrastructure, and practical software products.",
    images: ["/images/projects/kandu-production.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#101413" },
  ],
};

const themeScript = `
  (() => {
    try {
      const stored = localStorage.getItem("portfolio-theme");
      const preference = stored === "light" || stored === "dark" ? stored : "system";
      const theme = preference === "system"
        ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : preference;
      document.documentElement.dataset.theme = theme;
      document.documentElement.dataset.themePreference = preference;
      document.documentElement.style.colorScheme = theme;
      let savedPreferences = {};
      try {
        savedPreferences = JSON.parse(localStorage.getItem("portfolio-game-preferences") || "{}") || {};
      } catch (_) {}
      const systemReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const motion = ["full", "reduced", "minimal"].includes(savedPreferences.motion)
        ? savedPreferences.motion
        : systemReduced ? "reduced" : "full";
      const graphics = ["high", "balanced", "low"].includes(savedPreferences.graphics)
        ? savedPreferences.graphics
        : "balanced";
      document.documentElement.dataset.motion = new URLSearchParams(location.search).get("motion") === "off" ? "off" : motion;
      document.documentElement.dataset.graphics = graphics;
      const language = localStorage.getItem("portfolio-language") === "id" ? "id" : "en";
      document.documentElement.dataset.language = language;
      document.documentElement.lang = language;
    } catch (_) {}
  })();
`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  image: `${SITE_URL}/images/profile.jpg`,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jember",
    addressCountry: "Indonesia",
  },
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Politeknik Negeri Jember",
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: [
    "Next.js",
    "React",
    "TypeScript",
    "Firebase",
    "Laravel",
    "Linux",
    "Nginx",
    "Oracle Cloud",
    "GitHub Actions",
    "Computer networking",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="stylesheet" href={withBasePath("/vendor/mcicons/mcicons.css")} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>
        <MotionProvider />
        <MainMenuScreen />
        <a className="skip-link" href="#main-content">
          <LocalizedText en="Skip to main content" />
        </a>
        <Navbar />
        {children}
        <Footer />
        <PageTransition />
        <ScrollReveal />
        <LiquidGlassCursor />
      </body>
    </html>
  );
}
