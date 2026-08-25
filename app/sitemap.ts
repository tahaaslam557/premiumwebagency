import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { legalLinks } from "@/data/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // The four document routes. Read from the same list the footer renders, so
    // a route can never be linked and unlisted at the same time.
    ...legalLinks.map((link) => ({
      url: `${site.url}${link.href}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
