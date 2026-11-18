import type { Metadata } from "next";
import { A, Callout, Doc, P, Section, Table } from "@/components/legal/prose";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Cookies & Storage", description: `The cookies and browser storage ${brand.name} uses.` };

export default function CookiesPage() {
  return (
    <Doc
      title="Cookies & Storage"
      intro={
        <Callout>
          {brand.name} uses only what it needs to work. We don’t use advertising cookies, tracking pixels or third-party analytics, so there is no cookie banner to accept.
        </Callout>
      }
    >
      <Section title="What we store on your device">
        <Table
          head={["Name", "Type", "What it’s for", "How long"]}
          rows={[
            ["__Host-cojaunt_session", "Cookie (HTTP-only, secure, same-site)", "Keeps you signed in. Scripts on a page can’t read it", "Until you close the browser, or 30 days if you chose “Keep me signed in”. Removed when you sign out"],
            ["cojaunt:theme", "Local storage", "Remembers whether you chose the light or dark look", "Until you clear your browser data"],
            ["cojaunt:v6:… and cojaunt:owner:v1", "Local storage", "Your saved profile, settings and plans on this device, tied to your account", "Until you delete your account or clear your browser data"],
            ["cojaunt:here:v2", "Session storage", "Your approximate location (rounded to about 1 km) while you browse, so people and trips near you show first", "Until you close the tab"],
          ]}
        />
        <P>You can clear all of this in your browser settings. If you remove the sign-in cookie you’ll be signed out. If you block it, you won’t be able to sign in.</P>
      </Section>

      <Section title="What we don’t do">
        <P>We don’t set cookies for advertising, we don’t follow you around other sites, and we don’t share cookie or device data with advertisers.</P>
      </Section>

      <Section title="Third parties">
        <P>
          Payment, ID-verification and similar partners may set their own cookies on their own screens when you use them. Their policies apply there. Our <A href="/privacy">Privacy Policy</A> lists the kinds of partners we use.
        </P>
      </Section>

      <Section title="Preview note">
        <P>While {brand.name} is in preview, accounts and profile data you create are kept in your browser’s local storage on this device only, and nowhere else. Clearing your browser data removes them.</P>
      </Section>
    </Doc>
  );
}
