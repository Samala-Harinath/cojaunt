import type { Metadata } from "next";
import { A, Doc, List, P, Section, Table } from "@/components/legal/prose";
import { brand } from "@/lib/brand";
import { legal } from "@/lib/config";

export const metadata: Metadata = { title: "Grievance Redressal", description: `How to raise a complaint with ${brand.name}.` };

export default function GrievancePage() {
  return (
    <Doc
      title="Grievance Redressal"
      intro={<P>If something has gone wrong and you’re not happy with how it was handled, you can complain to our Grievance Officer. This page follows the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and the Digital Personal Data Protection Act, 2023.</P>}
    >
      <Section title="Our Grievance Officer">
        <Table
          head={["Detail", "Information"]}
          rows={[
            ["Name", legal.grievanceOfficer],
            ["Company", legal.company],
            ...(legal.address ? [["Address", legal.address]] : []),
            ["Email", <A key="e" href={`mailto:${legal.grievanceEmail}`}>{legal.grievanceEmail}</A>],
          ]}
        />
      </Section>

      <Section title="What to include">
        <List
          items={[
            "Your name, and the email or mobile number on your account",
            "What happened, when, and which profile, plan or message it’s about",
            "Screenshots or booking details, if you have them",
            "What outcome you’d like",
          ]}
        />
      </Section>

      <Section title="What happens next">
        <List
          ordered
          items={[
            "We acknowledge your complaint within 24 hours.",
            "We look into it and reply with a decision within 15 days.",
            "Complaints about intimate images shared without consent, or content that exposes someone’s private parts, are actioned within 24 hours of a report. Report them in the app or write to our safety team.",
            "For privacy complaints we will tell you what we found and what we did. If you’re still not satisfied, you may complain to the Data Protection Board of India.",
          ]}
        />
      </Section>

      <Section title="Other ways to reach us">
        <List
          items={[
            <>
              General help: <A href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</A>
            </>,
            <>
              Safety concerns: <A href={`mailto:${legal.safetyEmail}`}>{legal.safetyEmail}</A>
            </>,
            <>
              Privacy requests: <A href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</A>
            </>,
            <>
              Emergency: call <A href="tel:112">112</A>
            </>,
          ]}
        />
        <P>
          You can also use the National Consumer Helpline (1915) or the e-Daakhil portal for consumer complaints, and the National Cyber Crime Reporting Portal (cybercrime.gov.in, helpline 1930) for online fraud and abuse.
        </P>
      </Section>
    </Doc>
  );
}
