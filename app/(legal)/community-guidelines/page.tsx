import type { Metadata } from "next";
import { A, Callout, Doc, List, P, Section } from "@/components/legal/prose";
import { brand } from "@/lib/brand";
import { legal } from "@/lib/config";

export const metadata: Metadata = { title: "Community Guidelines & Safety", description: `How we keep ${brand.name} respectful and safe.` };

export default function GuidelinesPage() {
  return (
    <Doc
      title="Community Guidelines"
      intro={
        <>
          <P>
            {brand.name} works because people treat each other well. These guidelines say what we expect, what you can expect from us, and what to do when something goes wrong. They are part of our{" "}
            <A href="/terms">Terms of Service</A>.
          </P>
          <Callout>
            In danger right now? Call <A href="tel:112">112</A>. On a plan, use SOS in Trip Mode, which alerts your emergency contacts, the host and our safety team.
          </Callout>
        </>
      }
    >
      <Section title="Be real">
        <List
          items={[
            "Use your own recent photos. Your face should be clear in at least one.",
            "Tell the truth about your age, gender and relationship status. Singles features are for single members only.",
            "One person, one account. No fake, duplicate or impersonating accounts.",
          ]}
        />
      </Section>

      <Section title="Be respectful">
        <List
          items={[
            "No harassment, bullying, threats, hate, or discrimination on any ground.",
            "No sexual messages or images that weren’t asked for. “Not now” and silence both mean no. Don’t ask again.",
            "Take a decline well. You’ll never be told why someone said no, and you can’t send another request after a decline.",
            "Don’t pressure anyone to meet, share contact details, drink, or do anything they’re unsure about.",
          ]}
        />
      </Section>

      <Section title="Keep money and contact details in the right place">
        <List
          items={[
            "Seats are paid for in the app, where refunds are protected. Nobody should ask you to pay them directly, and you shouldn’t ask anyone else to.",
            "Don’t ask for money, loans, gifts, investments or crypto. This is the most common scam on any dating or social platform, and it is grounds for removal.",
            "Requests have to stay free of phone numbers, links and payment IDs. We screen for them and warn you before you send.",
            "Private details (surname, workplace, area, Instagram) unlock only when a request is accepted. Don’t share another person’s details without their say-so.",
          ]}
        />
      </Section>

      <Section title="Photos and content">
        <List
          items={[
            "No nudity, sexual content, violence or anything illegal.",
            "No one under 18, ever, in any photo or message.",
            "Don’t post photos of other people without their consent.",
            "We check photos with automated tools and people. We may remove a photo or ask you to take a new selfie.",
          ]}
        />
      </Section>

      <Section title="On a plan">
        <List
          items={[
            "Follow the host’s safety briefing and local rules. Don’t put yourself or others at risk.",
            "Respect everyone’s limits: pace, alcohol, privacy and personal space.",
            "Hosts must run the plan as described, keep everyone safe, and never charge outside the app.",
            "Meeting someone new? Prefer a group plan or a busy public place, and tell a friend where you’ll be.",
          ]}
        />
      </Section>

      <Section title="You are in control">
        <List
          items={[
            <>
              <strong>Mute</strong> someone to stop seeing them in Discover. They aren’t told.
            </>,
            <>
              <strong>Unfriend</strong> to close a chat and hide your private details again. They aren’t told.
            </>,
            <>
              <strong>Block</strong> to disappear from each other everywhere. They aren’t told.
            </>,
            <>
              <strong>Report</strong> anything that breaks these guidelines. Reports are private and go to our safety team.
            </>,
          ]}
        />
      </Section>

      <Section title="What happens when you report">
        <List
          items={[
            "We read every report. Serious ones (threats, stalking, minors, violence, someone at risk) are looked at first.",
            "We aim to respond within 24 hours.",
            "Depending on what we find, we may warn, limit or remove an account, and tell the police where the law requires it or when someone is at risk.",
            "We won’t tell the person you reported who reported them.",
          ]}
        />
        <P>
          Report from any profile, chat or plan, or write to <A href={`mailto:${legal.safetyEmail}`}>{legal.safetyEmail}</A>. If you disagree with a decision about your account, write to{" "}
          <A href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</A> and we’ll look again.
        </P>
      </Section>

      <Section title="What the AI does, and doesn’t do">
        <P>We use software to explain why a plan fits you, turn a plain-language search into filters you can see and remove, and warn you about scam patterns in a message before you send it. It never writes or rewrites your messages, edits or generates photos, or pretends to be a person.</P>
      </Section>
    </Doc>
  );
}
