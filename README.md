# Cojaunt

A social travel and dating app. Members send a **Spark** to someone they'd like to date, ask one person to be their **travel buddy**, or **request to join a hosted group** trip. Private details stay hidden until a request is accepted. This repository holds the frontend prototype.

- **How the app works, in plain language:** [`docs/HOW-IT-WORKS.md`](docs/HOW-IT-WORKS.md)
- Product thinking: [`docs/Dating-Travel-Platform-Blueprint.md`](docs/Dating-Travel-Platform-Blueprint.md)

**This is a prototype with no backend.** Plans, people, reviews and other members' choices are sample data. Nothing is sent, charged, verified or stored outside the browser. Every simulated step is labelled "Prototype" in the interface.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm build
```

For a production build, copy `.env.example` to `.env.local` and set `AUTH_SECRET` (32+ random characters). Without it nobody can sign in.

## Screens

| Route | Screen (blueprint §6.2) |
|---|---|
| `/` | Landing page (public) |
| `/login`, `/register`, `/forgot-password` | Sign in, create an account (mobile code, consent), reset a password (public) |
| `/privacy`, `/terms`, `/community-guidelines`, `/refunds`, `/cookies`, `/grievance`, `/contact` | Legal and help pages (public) |
| `/welcome` | S3–S8 after sign-up: basics, photo and selfie check, vibe quiz, interests and intent, privacy |
| `/account` | Password, sign out, policies, delete account |
| `/discover` | Three doors: Date (singles to Spark), Travel buddy (one person), Groups (hosted plans) |
| `/u/[id]` | Anyone's profile: photo gallery, public basics, locked private details, Spark / Travel together |
| `/plans/[id]` | S10–S12: group plan detail, join request, checkout |
| `/trips` | S13: upcoming, past, wishlist |
| `/chats`, `/chats/[id]` | S14: group chats and 1:1 chats |
| `/trip/[id]` | S15: Trip Mode with SOS |
| `/reflect/[id]` | S16: post-plan reflection |
| `/people` | Requests: received, sent and connected |
| `/profile` | S18: photos, private details, vibe answers |
| `/host` | S19: host dashboard: drafts, plans in review, requests and payout |
| `/host/studio?id=…` | Host Studio: create a Group trip or Singles trip in seven steps |
| `/safety` | S20: safety centre and data controls |
| `/plus` | Membership |

Everything except the public pages above needs a signed-in session. **Explore the demo** (on the landing and sign-in pages) signs in as a sample member (Ananya) so every screen has content. A real account goes through `/register`, then `/welcome`, and gets the same sample history (bookings, past plans, connections, chats, reviews) from `lib/sample.ts`, so nothing is empty. Each account has its own saved state (`cojaunt:v6:<account id>`), so two people on one device never see each other's data.

**Location:** the app works across India. Discover asks for location once, names it through `/api/place` (OpenStreetMap Nominatim, server-side, rate-limited and cached; override with `PLACE_LOOKUP_URL` and `PLACE_LOOKUP_USER_AGENT`), and falls back to the nearest city in `lib/india.ts` if the lookup fails. Before real traffic, point `PLACE_LOOKUP_URL` at a self-hosted Nominatim or a paid geocoder: the public server allows at most 1 request per second for the whole app.

## Sign-in and security

- **Route protection is deny-by-default** in `proxy.ts`: every page and API route needs a valid session cookie unless it is listed in `lib/auth/rules.ts`. Signed-in members who open `/login`, `/register` or `/` are sent into the app. `?next=` only accepts same-site paths.
- **The session cookie** (`lib/auth/session-token.ts`) is signed with HMAC-SHA256, expires, and is `HttpOnly`, `Secure`, `SameSite=Lax` and `__Host-` prefixed in production. "Keep me signed in" lasts 30 days; otherwise it ends with the browser. `/api/auth/session` reads, starts and ends it, rejects cross-site requests and is rate-limited.
- **`AuthGate`** (`components/auth/auth-gate.tsx`) wraps every signed-in layout. It renders nothing private until the session is confirmed, and re-checks when the tab returns, when another tab signs out, and when the browser restores a page from its back-forward cache.
- **Passwords** are never stored: only a salted PBKDF2-SHA256 hash (310,000 rounds). Accounts lock for 15 minutes after 5 wrong passwords. Sign-in and "forgot password" never reveal whether an account exists. One-time codes expire in 10 minutes, allow 5 tries and can be resent every 30 seconds (5 an hour).
- **Security headers** (CSP, HSTS, frame, referrer, permissions) are set in `next.config.ts`.
- **Legal pages** are in `app/(legal)`. Contact details and the company name come from environment variables (`.env.example`), and the version in `lib/config.ts` is saved with each account's consent.

### Prototype limits (the backend must replace these)

- **There is no server-side user database yet.** Accounts live in this browser (`lib/auth/accounts.ts`), and `/api/auth/session` issues a session to whoever asks, so the cookie only proves the browser called it. This is fine for a prototype with sample data and is **not safe for real members**. Replace it with the real sign-in endpoints; the contract is the function list at the top of `lib/auth/client.ts`.
- **No SMS or email is sent.** The one-time code is shown on screen (`components/auth/code-input.tsx`). The backend must text it and check it on the server.
- **Rate limits are per server process** (`lib/auth/rate-limit.ts`). The backend needs per-account and per-IP limits at the edge.

## How the code is organised

- `app/` holds routes only. `(app)` routes show the tab bar; `(focus)` routes (onboarding, chat threads, Trip Mode, reflection) do not; `(studio)` is the full-width Host Studio.
- `components/` holds the screens and shared pieces. Icons, cover art and avatars are hand-written SVG, so there are no image or icon dependencies.
- `lib/` holds data and logic:
  - `plans*.ts`, `directory.ts`, `social.ts`: sample data.
  - `store.ts`, `actions.ts`: client state saved to `localStorage`. Each action maps to one future API call.
  - `derive.ts`, `threads.ts`: rules such as "only mutual signals become connections".
  - `asks.ts`: Spark and travel-request rules (who may ask whom, pending caps, no re-asking after a decline, note screening, when private details unlock). The backend must re-enforce all of them.
  - `photos.ts`: photo upload checks; every photo is re-encoded, which strips EXIF and GPS data.
  - `match.ts`: the explained compatibility score (rules, no ML).
  - `concierge.ts`: plain-language search. A keyword parser stands in for a language model.
  - `safety.ts`: scam screening for outgoing messages.
  - `brand.ts`: product name, fees and prices in one place.
  - `listing*.ts`: the Host Studio model. `listing-options.ts` holds steps and choices, `listing-check.ts` the validation rules, `listing-dates.ts` date labels and `toPlan` (the shape the API should accept), `listing-tips.ts` non-blocking suggestions.

## Creating a trip

Hosting → **Host a Group trip or a Singles trip**. First choose who it's for (Singles trips are single-only, always mixed and limited to a 12-year age band, and only single members open to dating can host them), then a day plan or overnight trip, then work through seven steps: basics, when and where, itinerary, who it's for, pricing, safety, review. Every change autosaves to the browser, the live preview on the right shows the plan card guests will see, and errors appear only after you press Continue. "Send for review" moves the listing to *In review* on the dashboard, where it can be withdrawn to edit.

## Product rules the interface enforces

- No swipe deck. Profiles open on tap and show exactly the photos the member uploaded.
- Surname, workplace, area and Instagram stay hidden until a Spark or travel request is accepted.
- Nobody can message you unless you accepted their request (or they accepted yours), or you're in the same confirmed group.
- Sending a request needs a verified selfie. A declined request can't be sent again. Notes can't carry phone numbers, links or payment IDs.
- Group attendees are blurred until the host approves you.
- A one-sided "Travel again" or post-plan "Spark" is never shown to anyone.
- Women-only plans are hidden from men.
- AI helps find and explain plans, and warns about scam patterns. It does not write messages, edit photos or pose as a person.
- Safety features are never behind a paywall.

## Before a backend is built

- **Privacy rules are enforced only in the browser.** Women-only visibility, blurred attendees and chat access are checks in client code, and the sample data for all of them ships in the JavaScript bundle. A backend must enforce each one before any real member data exists.
- **Signals must be resolved on the server.** `lib/social.ts` ships other members' choices to the browser so the prototype can show mutual results. A real client must receive only mutual outcomes.
- **Fees and tax are placeholders.** The platform fee, GST line, commission rate and membership prices come from the blueprint's hypotheses and need an accountant's review.
- **Women-only visibility** treats non-binary members as able to see those plans. That is a placeholder for a product and policy decision.
- **SOS does nothing** except offer a `tel:112` link. Alerts, location sharing and check-ins need a backend and an on-call process before anyone relies on them.
- **Listing rules are client-side.** The backend must re-run every check in `lib/listing-check.ts` (dates, lead time, price limits, contact-detail screening, host pledges) and add photo upload, which the studio replaces with illustrated covers for now.
- **Legal copy is drafted, not approved.** The terms, privacy policy, community guidelines, refund policy, cookie page and grievance page are written to match what the product does, but a lawyer must review them and the company details must be filled in (`.env.example`) before launch. A "draft pending legal review" notice shows until `NEXT_PUBLIC_LEGAL_REVIEWED=1`.

## Stack

Next.js 16 (App Router, Cache Components, React Compiler), React 19, Tailwind CSS 4, TypeScript. Read `AGENTS.md` before changing framework code: this Next.js version differs from older releases.

