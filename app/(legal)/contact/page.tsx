import type { Metadata } from "next";
import { A, Doc, P, Section, Table } from "@/components/legal/prose";
import { brand } from "@/lib/brand";
import { legal } from "@/lib/config";

export const metadata: Metadata = { title: "Contact", description: `Get help from the ${brand.name} team.` };

export default function ContactPage() {
  return (
    <Doc title="Contact us" intro={<P>Pick the address that fits. We read everything, and we aim to reply within one working day.</P>}>
      <Section title="Who to write to">
        <Table
          head={["For", "Write to"]}
          rows={[
            ["Help with your account, plans or payments", <A key="s" href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</A>],
            ["Someone made you feel unsafe, or you want to report a member", <A key="f" href={`mailto:${legal.safetyEmail}`}>{legal.safetyEmail}</A>],
            ["Your data: access, correction, erasure", <A key="p" href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</A>],
            ["A complaint we haven’t resolved", <A key="g" href="/grievance">Grievance Officer</A>],
          ]}
        />
      </Section>

      <Section title="In an emergency">
        <P>
          Call <A href="tel:112">112</A>. On a plan, hold the SOS button in Trip Mode. Our team can’t send help to you directly, so contact the emergency services first.
        </P>
      </Section>

      <Section title="About us">
        <P>
          {legal.company} runs {brand.name}.{legal.address ? ` ${legal.address}.` : ""} Read our <A href="/terms">Terms</A> and <A href="/privacy">Privacy Policy</A>.
        </P>
      </Section>
    </Doc>
  );
}
