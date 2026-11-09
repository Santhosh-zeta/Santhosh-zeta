import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Search engines and AI answer engines are welcome: the goal of this site is to be found and cited.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
