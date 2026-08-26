import type { MetadataRoute } from "next";

import { legalLinks } from "@/data/navigation";
import { servicePages } from "@/data/service-pages";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // The three top-level routes.
    ...["/services", "/pricing", "/contact"].map((path) => ({
      url: `${site.url}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    // The service routes. Read from the same list the pages are generated
    // from, so a route cannot exist and go unlisted.
    ...servicePages.map((service) => ({
      url: `${site.url}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // The four document routes, read from the list the footer renders.
    ...legalLinks.map((link) => ({
      url: `${site.url}${link.href}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
