import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";
import { Scene } from "@/components/scene";
import { audiences } from "@/lib/audience";
import { brand } from "@/lib/brand";
import { getPlan, rupee, type Plan } from "@/lib/plans";
import { Reveal } from "./reveal";
import { Tilt } from "./tilt";

const wrap = "mx-auto w-full max-w-6xl px-5";

function Head({ eyebrow, title, body, center = false, light = false }: { eyebrow: string; title: React.ReactNode; body?: string; center?: boolean; light?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${light ? "text-marigold!" : "text-forest!"}`}>{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">{title}</h2>
      {body ? <p className={`mt-4 text-base leading-relaxed md:text-lg ${light ? "text-white/80" : "text-muted"}`}>{body}</p> : null}
    </Reveal>
  );
}

/* ───────── destinations strip ───────── */

const places = ["Bengaluru", "Mumbai", "Pune", "Delhi", "Goa", "Hyderabad", "Chennai", "Jaipur", "Rishikesh", "Manali", "Coorg", "Gokarna", "Pondicherry", "Kochi", "Udaipur", "Hampi"];

export function PlacesStrip() {
  return (
    <section aria-label="Places" className="border-y border-line bg-surface/60 py-5">
      <div className="marquee-wrap overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="marquee flex w-max items-center gap-10 pr-10">
          {[...places, ...places].map((place, i) => (
            <li key={i} aria-hidden={i >= places.length ? true : undefined} className="flex items-center gap-10 whitespace-nowrap font-display text-xl text-muted">
              {place}
              <span className="size-1.5 rounded-full bg-marigold" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── facts ───────── */

const facts: { value: string; label: string; icon: IconName }[] = [
  { value: "4 to 10", label: "people on every hosted trip, so nobody is lost in a crowd", icon: "people" },
  { value: "100%", label: "of members pass a photo and selfie check before they can ask anyone", icon: "shieldCheck" },
  { value: "0", label: "strangers who can message you. Chat opens only when you both say yes", icon: "lock" },
  { value: "₹0", label: "for safety tools: SOS, trip sharing, block and report are always free", icon: "shield" },
];

export function Facts() {
  return (
    <section className={`${wrap} py-14 md:py-20`} aria-label="Facts">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact, i) => (
          <Reveal as="li" key={fact.value} delay={i * 0.08} className="card relative overflow-hidden p-6">
            <span className="absolute -right-3 -top-3 grid size-20 place-items-center rounded-full bg-forest-soft text-forest">
              <Icon name={fact.icon} className="size-8" />
            </span>
            <p className="font-display text-4xl text-gradient md:text-5xl">{fact.value}</p>
            <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-muted">{fact.label}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/* ───────── three ways in ───────── */

const ways: { icon: IconName; art: string; title: string; body: string; points: string[]; cta: string }[] = [
  {
    icon: "heart",
    art: "from-spark-soft to-marigold-soft",
    title: "Date",
    body: "See verified singles near you, look through their photos, and send a Spark to someone you like.",
    points: ["Only singles who chose “Open to dating”", "Private details stay hidden until they accept", "A chat opens only when they say yes"],
    cta: "Meet singles",
  },
  {
    icon: "user",
    art: "from-forest-soft to-marigold-soft",
    title: "Travel buddy",
    body: "Find one verified person to travel with, and ask them to be your travel buddy.",
    points: ["People near you first", "Women-only or men-only if you prefer", "Mute, unfriend or block any time"],
    cta: "Find a buddy",
  },
  {
    icon: "map",
    art: "from-forest-soft to-line",
    title: "Trips",
    body: "Join a small hosted trip. Group trips are open to everyone; Singles trips are only for singles.",
    points: ["Groups of 4 to 10 with a vetted host", "Come alone or bring up to 4 friends", "Pay only after the host approves you"],
    cta: "See trips",
  },
];

export function Ways() {
  return (
    <section id="ways" className={`${wrap} scroll-mt-24 pb-16 md:pb-24`} aria-labelledby="ways-heading">
      <Head
        eyebrow="Three ways in"
        title={
          <span id="ways-heading">
            Pick what you <em className="text-forest">came for</em>
          </span>
        }
        body="Each one has its own place in the app, so dating, travel buddies and group trips never get mixed up."
      />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {ways.map((way, i) => (
          <Reveal as="li" key={way.title} delay={i * 0.1}>
            <Tilt className="h-full">
              <Link href="/register" className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-2xl">
                <span className={`relative grid h-32 place-items-center bg-gradient-to-br ${way.art}`}>
                  <span className="absolute -left-6 -top-6 size-24 rounded-full bg-white/30" />
                  <span className="absolute -bottom-8 right-4 size-28 rounded-full bg-white/20" />
                  <span className="tilt-pop grid size-16 place-items-center rounded-2xl bg-surface text-forest shadow-xl transition-transform group-hover:scale-110">
                    <Icon name={way.icon} className="size-8" />
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-6">
                  <span className="font-display text-2xl">{way.title}</span>
                  <span className="mt-2 text-sm leading-relaxed text-muted">{way.body}</span>
                  <span className="mt-4 space-y-2 text-sm">
                    {way.points.map((point) => (
                      <span key={point} className="flex gap-2.5">
                        <Icon name="check" className="mt-px size-4 shrink-0 text-forest" />
                        {point}
                      </span>
                    ))}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-forest">
                    {way.cta}
                    <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </Tilt>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/* ───────── sample plans ───────── */

const showcaseIds = ["coorg", "gokarna", "chikmagalur", "pondicherry"];

function PlanTile({ plan }: { plan: Plan }) {
  const info = audiences[plan.audience];
  return (
    <Tilt className="h-full" max={6}>
      <Link href="/register" className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-2xl">
        <span className="relative block overflow-hidden">
          <Scene name={plan.scene} className="h-40 w-full transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute left-3 top-3 flex gap-1.5">
            <span className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-bold ${plan.audience === "dating" ? "bg-spark text-white" : "bg-surface/95 text-ink"}`}>{info.label}</span>
            {plan.womenOnly ? <span className="rounded-full bg-plum px-2.5 py-1 text-[0.6875rem] font-bold text-white">Women only</span> : null}
          </span>
        </span>
        <span className="flex flex-1 flex-col p-4">
          <span className="font-display text-xl leading-tight">{plan.title}</span>
          <span className="mt-1.5 flex items-center gap-1 text-xs text-muted">
            <Icon name="pin" className="size-3.5" />
            {plan.place}
          </span>
          <span className="mt-1 flex items-center gap-1 text-xs text-muted">
            <Icon name="calendar" className="size-3.5" />
            {plan.whenShort} · {plan.duration}
          </span>
          <span className="mt-auto flex items-center justify-between pt-4 text-sm">
            <span className="font-bold">{rupee(plan.price)}</span>
            <span className="text-xs font-semibold text-muted">{plan.seats} seats</span>
          </span>
        </span>
      </Link>
    </Tilt>
  );
}

export function Showcase() {
  const items = showcaseIds.map(getPlan).filter((plan): plan is Plan => Boolean(plan));
  return (
    <section id="plans" className="scroll-mt-24 bg-surface/60 py-16 md:py-24" aria-labelledby="plans-heading">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Head
            eyebrow="A look inside"
            title={
              <span id="plans-heading">
                Small trips, <em className="text-forest">real hosts</em>
              </span>
            }
            body="A few of the sample plans you’ll find once you’re in. Every plan shows the itinerary, what’s included, the host and the cancellation rules before you pay."
          />
          <Reveal>
            <Link href="/register" className="btn btn-line btn-sm">
              See all plans
              <Icon name="arrow" className="size-4" />
            </Link>
          </Reveal>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((plan, i) => (
            <Reveal as="li" key={plan.id} delay={i * 0.08}>
              <PlanTile plan={plan} />
            </Reveal>
          ))}
        </ul>
        <p className="mt-5 text-xs text-muted">Sample plans shown for illustration. Prices include the host’s fee; the platform fee of ₹{brand.platformFee} per seat is shown at checkout.</p>
      </div>
    </section>
  );
}

/* ───────── how it works ───────── */

const steps: { icon: IconName; title: string; body: string }[] = [
  { icon: "user", title: "Create your profile", body: "Sign up in about three minutes. Add photos, take a quick selfie check and answer six travel-style questions." },
  { icon: "compass", title: "Choose what you want", body: "Date someone, find a travel buddy, or join a hosted trip. Search in plain words, like “a slow women-only trip under 7k”." },
  { icon: "send", title: "Ask, and they decide", body: "Send a Spark, a travel request or a join request. The other person or the host accepts or declines. Nobody is told why." },
  { icon: "shieldCheck", title: "Meet, safely", body: "Trip Mode shares your plan with your emergency contacts and has a hold-to-send SOS. Afterwards, tell us privately who you’d travel with again." },
];

export function HowItWorks() {
  return (
    <section id="how" className={`${wrap} scroll-mt-24 py-16 md:py-24`} aria-labelledby="how-heading">
      <Head
        eyebrow="How it works"
        center
        title={
          <span id="how-heading">
            From hello to <em className="text-forest">on the road</em>
          </span>
        }
        body="No swiping, no endless scrolling. A few clear steps, and you decide at every one."
      />
      <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
        <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-7 hidden border-t-2 border-dashed border-line md:block" />
        {steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i * 0.1} className="relative text-center">
            <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-forest text-white shadow-lg shadow-forest/30">
              <Icon name={step.icon} className="size-6" />
              <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-marigold text-xs font-bold text-night">{i + 1}</span>
            </span>
            <h3 className="mt-5 font-display text-xl">{step.title}</h3>
            <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-muted">{step.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ───────── safety ───────── */

const safety: { icon: IconName; title: string; body: string }[] = [
  { icon: "camera", title: "Selfie check for everyone", body: "You can’t send a request until your selfie matches your photos." },
  { icon: "id", title: "Government ID for overnight trips", body: "We keep the result, never the document." },
  { icon: "eyeOff", title: "Hidden until accepted", body: "Surname, workplace, area and Instagram unlock only when you both say yes." },
  { icon: "phone", title: "SOS and trip sharing", body: "Hold to send an alert to your contacts, the host and our team. Call 112 in one tap." },
  { icon: "flag", title: "Block, mute, report", body: "One tap each. The other person is never told." },
  { icon: "alert", title: "Scam warnings", body: "We warn you before you send a phone number, UPI ID or link in a chat." },
];

export function SafetyBand() {
  return (
    <section id="safety" className="relative scroll-mt-24 overflow-hidden bg-band py-16 text-white md:py-24" aria-labelledby="safety-heading">
      <div aria-hidden="true" className="blob absolute -right-24 -top-24 size-[28rem] rounded-full bg-white/5" />
      <div aria-hidden="true" className="blob absolute -bottom-32 -left-16 size-[26rem] rounded-full bg-marigold/10" style={{ animationDelay: "-8s" }} />
      <div className={`${wrap} relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]`}>
        <div>
          <Head
            light
            eyebrow="Safety first"
            title={
              <span id="safety-heading">
                Safety is the product, <em>not a feature.</em>
              </span>
            }
            body="Meeting new people should feel easy. So the checks, the controls and the emergency tools are built in, and free for everyone, always."
          />
          <ul className="mt-9 grid gap-3 sm:grid-cols-2">
            {safety.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.06} className="rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10 backdrop-blur-sm">
                <span className="flex items-center gap-2.5 text-sm font-bold">
                  <Icon name={item.icon} className="size-5 text-marigold" />
                  {item.title}
                </span>
                <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-white/80">{item.body}</span>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="stage mx-auto w-full max-w-sm" aria-hidden="true">
          <div className="sway">
            <div className="relative rounded-[2rem] bg-surface p-6 text-ink shadow-[0_50px_90px_-30px_rgb(0_0_0/0.6)]">
              <div className="grid size-20 place-items-center rounded-3xl bg-forest-soft text-forest" style={{ transform: "translateZ(60px)" }}>
                <Icon name="shieldCheck" className="size-11" />
              </div>
              <p className="mt-4 font-display text-2xl" style={{ transform: "translateZ(30px)" }}>
                You’re protected
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {["Photo and selfie verified", "ID checked for overnight trips", "Emergency contacts added", "Trip Mode ready, SOS armed"].map((line, i) => (
                  <li key={line} className="flex items-center gap-2.5 rounded-xl bg-paper px-3 py-2.5 font-semibold" style={{ transform: `translateZ(${20 + i * 10}px)` }}>
                    <span className="grid size-5 place-items-center rounded-full bg-forest text-white">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <span className="float absolute -right-4 -top-4 grid size-14 place-items-center rounded-2xl bg-danger text-white shadow-xl" style={{ transform: "translateZ(90px)" }}>
                <Icon name="phone" className="size-6" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── privacy ladder ───────── */

const ladder: { icon: IconName; title: string; tone: string; items: string[] }[] = [
  {
    icon: "eye",
    title: "Everyone can see",
    tone: "bg-forest-soft text-forest-deep",
    items: ["Your photos and first name", "Your age, never your birth date", "A short bio and interests", "Your verified badge", "Roughly how far away you are"],
  },
  {
    icon: "lock",
    title: "Only after you both say yes",
    tone: "bg-marigold-soft text-amber-ink",
    items: ["Your surname and workplace", "The area you live in", "Your Instagram handle", "A private chat"],
  },
  {
    icon: "eyeOff",
    title: "Never shown to anyone",
    tone: "bg-spark-soft text-spark",
    items: ["Whether you’re open to dating", "Who you declined, muted or blocked", "Your exact location", "Your ID document or selfie"],
  },
];

export function PrivacyLadder() {
  return (
    <section id="privacy" className={`${wrap} scroll-mt-24 py-16 md:py-24`} aria-labelledby="privacy-heading">
      <Head
        eyebrow="Your privacy"
        title={
          <span id="privacy-heading">
            You decide <em className="text-forest">who sees what</em>, and when
          </span>
        }
        body="Trust is built in steps. This is exactly what is shown at each one."
      />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {ladder.map((rung, i) => (
          <Reveal as="li" key={rung.title} delay={i * 0.1}>
            <Tilt className="h-full" max={5}>
              <div className="card h-full p-6">
                <span className={`grid size-12 place-items-center rounded-2xl ${rung.tone}`}>
                  <Icon name={rung.icon} className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-xl">{rung.title}</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {rung.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <Icon name={i === 2 ? "x" : "check"} className={`mt-px size-4 shrink-0 ${i === 2 ? "text-spark" : "text-forest"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/* ───────── hosts ───────── */

const hostPoints = ["Create a plan in seven guided steps, with a live preview of the card guests will see", "Approve who joins, and keep the mix right with women-only, men-only and Singles options", "Guests pay in the app, and you’re paid after the trip, once there’s no open safety report", "Host pledges, check-ins and an SOS flow keep every trip safe"];

export function Hosts() {
  return (
    <section id="hosts" className="scroll-mt-24 bg-surface/60 py-16 md:py-24" aria-labelledby="hosts-heading">
      <div className={`${wrap} grid items-center gap-12 lg:grid-cols-2`}>
        <div className="order-2 lg:order-1">
          <div className="stage mx-auto w-full max-w-md" aria-hidden="true">
            <div className="stage-inner" style={{ ["--rx" as string]: "8deg", ["--ry" as string]: "14deg" }}>
              <div className="layer rounded-3xl border border-line bg-surface p-5 shadow-2xl" style={{ ["--z" as string]: "0px" }}>
                <div className="flex items-center justify-between">
                  <p className="font-display text-xl">Host dashboard</p>
                  <span className="tag bg-forest-soft text-forest-deep">Live</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
                  {[
                    ["3", "requests"],
                    ["6/8", "seats"],
                    ["₹38k", "after trip"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl bg-paper px-2 py-3">
                      <p className="text-lg font-bold">{value}</p>
                      <p className="text-[0.6875rem] text-muted">{label}</p>
                    </div>
                  ))}
                </div>
                <ul className="mt-4 space-y-2">
                  {[
                    ["Aarav, 29", "Verified · 2 trips done"],
                    ["Meera, 32", "Verified · Joining alone"],
                  ].map(([name, line]) => (
                    <li key={name} className="flex items-center gap-3 rounded-2xl border border-line px-3 py-2.5">
                      <span className="size-9 rounded-full bg-gradient-to-br from-marigold to-forest" />
                      <span className="flex-1 leading-tight">
                        <span className="block text-sm font-bold">{name}</span>
                        <span className="block text-[0.6875rem] text-muted">{line}</span>
                      </span>
                      <span className="rounded-full bg-forest px-3 py-1 text-xs font-semibold text-white">Approve</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="layer float absolute -right-3 -top-5" style={{ ["--z" as string]: "80px" }}>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-marigold px-3.5 py-2 text-xs font-bold text-night shadow-xl">
                  <Icon name="wallet" className="size-4" />
                  Payout released
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <Head
            eyebrow="For hosts"
            title={
              <span id="hosts-heading">
                Run a trip. <em className="text-forest">Fill it with good people.</em>
              </span>
            }
            body="If you organise treks, weekends or day plans, Cojaunt gives you verified guests, approvals and payments in one place, instead of chasing people on WhatsApp."
          />
          <ul className="mt-6 space-y-3">
            {hostPoints.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed">
                <Icon name="check" className="mt-0.5 size-5 shrink-0 text-forest" />
                {point}
              </li>
            ))}
          </ul>
          <Reveal className="mt-8">
            <Link href="/register" className="btn btn-primary">
              Become a host
              <Icon name="arrow" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── AI ───────── */

const aiDoes = ["Turns “a slow women-only trip under 7k” into filters you can see and remove", "Explains why a plan fits you, using only your own quiz answers", "Flags scam patterns in a message before you send it"];
const aiNever = ["Writes or rewrites your messages", "Edits or generates profile photos", "Pretends to be a person, a match or a companion"];

export function AiSection() {
  return (
    <section className={`${wrap} py-16 md:py-24`} aria-labelledby="ai-heading">
      <Head
        eyebrow="Honest about AI"
        title={
          <span id="ai-heading">
            Where AI helps, <em className="text-forest">and where it stops</em>
          </span>
        }
        body="You came to meet people. So the software helps you find the plan, then gets out of the way."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[
          { title: "It does", icon: "check" as const, items: aiDoes, tone: "text-forest" },
          { title: "It never", icon: "x" as const, items: aiNever, tone: "text-spark" },
        ].map((col, i) => (
          <Reveal key={col.title} delay={i * 0.1}>
            <div className="card h-full p-6">
              <h3 className="font-display text-2xl">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Icon name={col.icon} className={`mt-px size-4 shrink-0 ${col.tone}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */

const faqs: { q: string; a: React.ReactNode }[] = [
  { q: "Is Cojaunt only a dating app?", a: "No. Dating is one of three ways in, and it’s optional. You can also find a travel buddy, or just join a hosted group trip. Dating and Singles trips are only for single members who choose “Open to dating”, and that choice is private." },
  { q: "Who can see my profile?", a: "Photos, first name, age, a short bio, interests and your verified badge are visible to other members, based on your visibility setting. Surname, workplace, area and Instagram unlock only after someone’s request is accepted. You can hide yourself from your phone contacts too." },
  { q: "How much does it cost?", a: `Browsing and safety tools are free. When you book a seat you pay the host’s price plus a platform fee of ₹${brand.platformFee} per seat. Plus members pay no platform fee. The full price is shown before you pay.` },
  { q: "How do you verify people?", a: "Everyone completes a photo and selfie check before they can send a request. Overnight trips also need a government ID check. We keep the result, not the document or selfie." },
  { q: "What if someone makes me uncomfortable?", a: "Mute, unfriend, block or report them in one tap. They’re never told. On a trip, hold the SOS button to alert your emergency contacts, the host and our team, or call 112." },
  { q: "I’m married. Can I use it?", a: "Yes, for travel buddies and Group trips. Sparks and Singles trips are for single members only." },
  { q: "Which cities does it cover?", a: `Anywhere in ${brand.region}. We ask for your location once, to show people and trips near you first. You can choose a city instead.` },
  { q: "Can I get a refund if I can’t go?", a: <>Yes, depending on how early you cancel, and always in full if the host cancels. See <Link href="/refunds" className="font-semibold text-forest underline underline-offset-4">Refunds &amp; Cancellations</Link>.</> },
  { q: "How is my data protected?", a: <>Your data is used only to run the service, never sold, and you can download or delete it any time. Read the <Link href="/privacy" className="font-semibold text-forest underline underline-offset-4">Privacy Policy</Link>.</> },
];

export function Faq() {
  return (
    <section id="faq" className={`${wrap} scroll-mt-24 pb-16 md:pb-24`} aria-labelledby="faq-heading">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Head
          eyebrow="Questions"
          title={
            <span id="faq-heading">
              Good things <em className="text-forest">to know</em>
            </span>
          }
          body="Can’t find your answer? Write to us and a person will reply."
        />
        <Reveal>
          <div className="card divide-y divide-line overflow-hidden">
            {faqs.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[0.9375rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Icon name="down" className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── closing call to action ───────── */

export function Closing({ children }: { children: React.ReactNode }) {
  return (
    <section className={`${wrap} pb-16 md:pb-24`} aria-labelledby="cta-heading">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-band px-6 py-14 text-center text-white md:px-12 md:py-20">
          <div aria-hidden="true" className="blob absolute -left-16 -top-16 size-72 rounded-full bg-marigold/20 blur-2xl" />
          <div aria-hidden="true" className="blob absolute -bottom-20 -right-10 size-80 rounded-full bg-white/10 blur-2xl" style={{ animationDelay: "-7s" }} />
          <div aria-hidden="true" className="stage absolute inset-0 hidden md:block">
            <div className="float absolute left-[6%] top-[22%] w-32 -rotate-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20" style={{ ["--t" as string]: "7s" }}>
              <Scene name="peaks" className="h-20 w-full" />
            </div>
            <div className="float absolute bottom-[14%] right-[6%] w-36 rotate-6 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20" style={{ ["--t" as string]: "8s", ["--d" as string]: "-3s" }}>
              <Scene name="forest" className="h-24 w-full" />
            </div>
            <div className="float absolute right-[12%] top-[14%] w-24 rotate-3 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20" style={{ ["--t" as string]: "6s", ["--d" as string]: "-1s" }}>
              <Scene name="city" className="h-16 w-full" />
            </div>
          </div>
          <div className="relative mx-auto max-w-2xl">
            <h2 id="cta-heading" className="font-display text-4xl leading-tight md:text-6xl">
              Your next plan is <em>one request away.</em>
            </h2>
            <p className="mt-4 text-base text-white/80 md:text-lg">Join verified people who’d rather do something together than swipe on each other.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
            <p className="mt-5 text-xs text-white/60">Free to join · 18+ only · Safety tools always free</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
