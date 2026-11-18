import Link from "next/link";
import { brand } from "@/lib/brand";
import { legal, legalPages } from "@/lib/config";

/** Footer for public pages: legal links, contact, and the honest prototype note. */
export function SiteFooter({ note }: { note?: React.ReactNode }) {
  return (
    <footer className="mt-10 border-t border-line py-10 text-sm text-muted">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold text-ink">{brand.name}</p>
          <p className="mt-1">{brand.tagline}</p>
          <p className="mt-3 max-w-xs leading-relaxed">Small-group trips, travel buddies and dating for verified adults across {brand.region}.</p>
        </div>
        <nav aria-label="Legal">
          <p className="eyebrow">Legal</p>
          <ul className="mt-3 space-y-2">
            {legalPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="underline-offset-4 hover:text-ink hover:underline">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow">Need help?</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a href={`mailto:${legal.supportEmail}`} className="underline-offset-4 hover:text-ink hover:underline">
                {legal.supportEmail}
              </a>
            </li>
            <li>
              In danger? Call{" "}
              <a href="tel:112" className="font-semibold text-ink underline underline-offset-4">
                112
              </a>
            </li>
          </ul>
        </div>
      </div>
      {note ? <div className="mt-8 border-t border-line pt-6">{note}</div> : null}
      <p className="mt-6 text-xs">
        © {legal.version.slice(0, 4)} {legal.company}. All rights reserved.
      </p>
    </footer>
  );
}
