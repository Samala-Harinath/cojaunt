/**
 * Deployment settings, read from environment variables (see .env.example).
 * NEXT_PUBLIC_* values are visible in the browser, so nothing secret belongs here.
 */
export const site = {
  /** Public address of the site. Used for canonical links, the sitemap and social previews. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  /** "Explore the demo" signs in as a sample member. Set NEXT_PUBLIC_DEMO_MODE=off to hide it for a real launch. */
  demo: process.env.NEXT_PUBLIC_DEMO_MODE !== "off",
};

/**
 * Who we are, for the legal pages. Every value can be overridden per deployment.
 * The defaults are placeholders: fill them in (and have a lawyer review the legal pages)
 * before real members sign up. Set NEXT_PUBLIC_LEGAL_REVIEWED=1 to remove the "draft" notice.
 */
export const legal = {
  /** Bump when the Terms or Privacy Policy change in a way that needs fresh consent. */
  version: "2026-11-18",
  updated: "18 November 2026",
  company: process.env.NEXT_PUBLIC_COMPANY_NAME || "Cojaunt",
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "",
  /** City whose courts the Terms name. */
  jurisdiction: process.env.NEXT_PUBLIC_JURISDICTION_CITY || "Bengaluru, Karnataka",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@cojaunt.example",
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || "privacy@cojaunt.example",
  safetyEmail: process.env.NEXT_PUBLIC_SAFETY_EMAIL || "safety@cojaunt.example",
  grievanceOfficer: process.env.NEXT_PUBLIC_GRIEVANCE_OFFICER || "Grievance Officer",
  grievanceEmail: process.env.NEXT_PUBLIC_GRIEVANCE_EMAIL || "grievance@cojaunt.example",
  reviewed: process.env.NEXT_PUBLIC_LEGAL_REVIEWED === "1",
} as const;

/** The legal pages, in the order the footer lists them. */
export const legalPages = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/community-guidelines", label: "Community Guidelines" },
  { href: "/refunds", label: "Refunds & Cancellations" },
  { href: "/cookies", label: "Cookies & Storage" },
  { href: "/grievance", label: "Grievance Redressal" },
  { href: "/contact", label: "Contact" },
] as const;
