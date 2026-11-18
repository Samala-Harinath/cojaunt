import type { MetadataRoute } from "next";
import { legalPages, site } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, priority: 1 }, ...legalPages.map((page) => ({ url: `${site.url}${page.href}`, priority: 0.3 }))];
}
