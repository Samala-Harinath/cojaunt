import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

/** Public pages can be indexed. Everything behind sign-in, and the API, is off limits. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms", "/cookies", "/community-guidelines", "/refunds", "/grievance", "/contact"],
        disallow: ["/api/", "/discover", "/trips", "/chats", "/people", "/profile", "/account", "/safety", "/host", "/plus", "/plans", "/u/", "/trip/", "/reflect/", "/welcome", "/login", "/register", "/forgot-password"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
