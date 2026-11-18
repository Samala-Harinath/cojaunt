import Link from "next/link";
import { DemoButton } from "@/components/auth/demo-button";
import { QueryNotice } from "@/components/auth/query-notice";
import { Icon } from "@/components/icon";
import { HeroStage } from "@/components/landing/hero-stage";
import { AiSection, Closing, Faq, Facts, Hosts, HowItWorks, PlacesStrip, PrivacyLadder, SafetyBand, Showcase, Ways } from "@/components/landing/sections";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme";
import { Logo } from "@/components/ui";
import { brand } from "@/lib/brand";
import { site } from "@/lib/config";
import { getPlan, rupee } from "@/lib/plans";

/** Section links in the header. They scroll the page; they don't open the app. */
const links = [
  { href: "#how", label: "How it works" },
  { href: "#safety", label: "Safety" },
  { href: "#hosts", label: "For hosts" },
  { href: "#faq", label: "FAQ" },
];

const trust = ["Photo + selfie verified", "Private until you both say yes", "Safety tools always free"];

export default function LandingPage() {
  const featured = getPlan("coorg");

  return (
    <div className="w-full overflow-x-clip">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/80 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-5 py-3">
          <Link href="/" aria-label={`${brand.name} home`}>
            <Logo />
          </Link>
          <nav aria-label="Sections" className="mx-auto hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-ink">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <ThemeToggle />
            <Link href="/login" className="btn btn-line btn-sm">
              Sign in
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto w-full max-w-6xl px-5">
          <QueryNotice param="deleted">Your account and its data were deleted from this device.</QueryNotice>
        </div>

        {/* Hero */}
        <section className="relative" aria-labelledby="hero-heading">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_78%_20%,var(--color-marigold-soft),transparent),radial-gradient(50%_50%_at_8%_80%,var(--color-forest-soft),transparent)]" />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-12 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rise">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-forest opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-forest" />
                </span>
                Small-group trips across {brand.region}
              </p>
              <h1 id="hero-heading" className="mt-6 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
                Plans, <em className="text-gradient pr-1">not</em> profiles.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Join a small hosted trip, find a travel buddy, or meet verified singles, anywhere in India. Everyone is checked, and your private details stay hidden until you both say yes.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/register" className="btn btn-primary">
                  Get started free
                  <Icon name="arrow" />
                </Link>
                {site.demo ? (
                  <DemoButton className="btn btn-line" label="Explore the demo" />
                ) : (
                  <Link href="/login" className="btn btn-line">
                    Sign in
                  </Link>
                )}
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-muted">
                {trust.map((line) => (
                  <li key={line} className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-forest-soft text-forest">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {featured ? <HeroStage title={featured.title} place={featured.place} when={featured.whenShort} price={rupee(featured.price)} going={3} /> : null}
          </div>
        </section>

        <PlacesStrip />
        <Facts />
        <Ways />
        <Showcase />
        <HowItWorks />
        <SafetyBand />
        <PrivacyLadder />
        <Hosts />
        <AiSection />
        <Faq />
        <Closing>
          <Link href="/register" className="btn btn-light">
            Create your free account
            <Icon name="arrow" />
          </Link>
          <Link href="/login" className="btn border border-white/40 text-white hover:bg-white/10">
            I already have an account
          </Link>
        </Closing>
      </main>

      <div className="mx-auto w-full max-w-6xl px-5">
        <SiteFooter
          note={
            <p>
              <strong className="text-ink">{brand.name} is a design prototype.</strong> The plans, people and reviews shown are sample content, and no bookings, payments or messages are real.
            </p>
          }
        />
      </div>
    </div>
  );
}
