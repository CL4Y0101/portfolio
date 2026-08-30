import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
    })),
  ];
}
