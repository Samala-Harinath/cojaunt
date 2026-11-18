import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeSync } from "@/components/theme";
import { brand } from "@/lib/brand";
import { site } from "@/lib/config";
import { themeColors, themeScript } from "@/lib/theme";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const description = "Meet people on small-group trips and weekend plans. Everyone is verified, and romance is optional, private and mutual.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: brand.name,
  title: { default: `${brand.name} · ${brand.tagline}`, template: `%s · ${brand.name}` },
  description,
  openGraph: { type: "website", siteName: brand.name, title: `${brand.name} · ${brand.tagline}`, description, locale: "en_IN" },
  twitter: { card: "summary", title: `${brand.name} · ${brand.tagline}`, description },
  manifest: "/manifest.webmanifest",
  // The tab icon follows the browser's colour scheme: a dark mark on light tab bars, a cream mark on dark ones.
  // Files live in public/favicon/light and public/favicon/dark.
  icons: {
    icon: [
      { url: "/favicon/light/favicon.ico", sizes: "any", media: "(prefers-color-scheme: light)" },
      { url: "/favicon/light/favicon-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon/light/favicon-16x16.png", sizes: "16x16", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/favicon/dark/favicon.ico", sizes: "any", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon/dark/favicon-32x32.png", sizes: "32x32", type: "image/png", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon/dark/favicon-16x16.png", sizes: "16x16", type: "image/png", media: "(prefers-color-scheme: dark)" },
    ],
    // iOS ignores media queries on touch icons, so it gets one version.
    apple: "/favicon/light/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: themeColors.light },
    { media: "(prefers-color-scheme: dark)", color: themeColors.dark },
  ],
  viewportFit: "cover",
};

// suppressHydrationWarning applies one level deep only, so mismatches inside the page are still reported.
// <html>: data-theme is corrected by the inline script before paint.
// <body>: browser extensions (Grammarly, translators, dark-mode and password tools) add attributes here before React loads.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
