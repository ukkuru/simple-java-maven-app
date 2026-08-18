import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/register",
        "/dashboard",
        "/analyze",
        "/history",
        "/settings",
        "/admin",
        "/templates",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
