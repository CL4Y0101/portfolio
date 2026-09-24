import type { ReactNode } from "react";
import { profile } from "@/data/profile";

export function CvDownloadLink({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <>
      <a className={`cv-download-link ${className}`.trim()} data-cv-language="en" href={profile.cv.en} download lang="en">
        {children}
      </a>
      <a className={`cv-download-link ${className}`.trim()} data-cv-language="id" href={profile.cv.id} download lang="id">
        {children}
      </a>
    </>
  );
}
