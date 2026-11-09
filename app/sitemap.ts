import type { MetadataRoute } from "next";
import { PROJECTS, SITE, projectUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...PROJECTS.map((p) => ({ url: projectUrl(p.slug), lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
