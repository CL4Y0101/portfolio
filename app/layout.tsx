import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { profile } from "@/data/profile";
import { SITE_URL } from "@/lib/constants";
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
      const theme = stored || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Navbar />
        {children}
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
