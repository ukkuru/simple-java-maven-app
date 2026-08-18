import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

// Only the public, indexable marketing pages. Auth routes (/login,
// /register) and the authenticated app (/dashboard, /analyze, /history,
// /settings, /admin, /templates) are deliberately excluded — a sitemap full
// of auth or private routes signals a thin site rather than helping crawlers.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/free-ai-user-story-generator`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/faq`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
