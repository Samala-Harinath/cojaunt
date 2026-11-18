import type { Metadata } from "next";
import { A, Callout, Doc, List, P, Section, Table } from "@/components/legal/prose";
import { brand } from "@/lib/brand";
import { cancellation } from "@/lib/plan-types";
import { legal } from "@/lib/config";

export const metadata: Metadata = { title: "Refunds & Cancellations", description: `How refunds and cancellations work on ${brand.name}.` };

export default function RefundsPage() {
  return (
    <Doc
      title="Refunds & Cancellations"
      intro={
        <>
          <P>This page explains what happens to your money when you book a seat, cancel it, or a host cancels. The rules for each plan are also shown on the plan page and at checkout, before you pay.</P>
          <Callout>Seats are paid for in the app and held until the plan has happened. Never send money to a host or member directly. If someone asks you to, report them.</Callout>
        </>
      }
    >
      <Section title="1. How booking works">
        <List
          ordered
          items={[
            "You ask to join a plan. Nothing is charged yet.",
            "The host approves your request.",
            "You pay to confirm your seat. Your payment is held by our payment partner.",
            "After the plan has taken place, and once there are no open safety reports, the host is paid, less our commission. You can raise a problem until then.",
          ]}
        />
      </Section>

      <Section title="2. If you cancel">
        <P>You can cancel your seat from My plans. What you get back depends on the kind of plan and how far ahead you cancel:</P>
        <Table
          head={["Plan", "When you cancel", "Refund"]}
          rows={[
            ["Overnight trip", "7 or more days before the start", "Full refund of the seat price"],
            ["Overnight trip", "3 to 6 days before", "50% of the seat price"],
            ["Overnight trip", "Under 72 hours before", "No refund. We’ll try to give your seat to someone on the waitlist"],
            ["Day plan", "24 hours or more before", "Full refund of the seat price"],
            ["Day plan", "Under 24 hours before", "No refund"],
          ]}
        />
        <P>The platform fee is returned only where the seat price is refunded in full. A host may set a more generous policy, which will be shown on the plan. Plus members get one free late cancellation each quarter.</P>
        <P>The exact rules shown on a plan at the time you book are the ones that apply to your booking. Today they read:</P>
        <ul className="list-disc space-y-1.5 pl-5 text-[0.9375rem]">
          {Object.entries(cancellation).map(([kind, rules]) => (
            <li key={kind}>
              <strong>{kind === "trip" ? "Overnight trips" : "Day plans"}:</strong> {rules.join("; ")}.
            </li>
          ))}
        </ul>
      </Section>

      <Section title="3. If the host cancels, or a plan changes">
        <List
          items={[
            "If a host cancels a plan, you get a full refund, including the platform fee. We guarantee this.",
            "If a host makes a major change (the date, the place, the price, or the type of plan), you can cancel for a full refund within 48 hours of being told.",
            "If a plan is cancelled for safety, weather, or events outside anyone’s control, we will offer a full refund, or to move you to another plan.",
          ]}
        />
      </Section>

      <Section title="4. If something goes wrong on the plan">
        <P>
          If the plan wasn’t what the host described, or you had a safety problem, report it from the plan within 7 days after it ended, or write to <A href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</A>. We will look
          into it, and may refund part or all of the seat price. Payment to the host is held while a safety report is open.
        </P>
      </Section>

      <Section title="5. When refunds are paid">
        <List
          items={[
            "We start the refund as soon as it is approved. Your bank or UPI app usually shows it within 5 to 7 working days, depending on your bank.",
            "Refunds go back to the method you paid with.",
            "If you don’t see a refund in 10 working days, write to us with your booking details.",
          ]}
        />
      </Section>

      <Section title="6. Plus membership">
        <P>
          You can cancel Plus at any time and keep it until the end of the period you paid for. We don’t refund the unused part of a period, unless the law says otherwise or we’ve made a mistake. If you were charged
          twice, or after you cancelled, tell us and we’ll refund it.
        </P>
      </Section>

      <Section title="7. Deleting your account">
        <P>Deleting your account doesn’t cancel your bookings. Cancel any plans you can’t attend first, so the refund rules above apply. If you delete your account with a booking still open, we’ll treat it as a cancellation made on that day.</P>
      </Section>

      <Section title="8. Questions or complaints">
        <P>
          Write to <A href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</A>. If we can’t fix it, use our <A href="/grievance">Grievance Redressal</A> process. Your rights under the Consumer Protection Act, 2019 are not affected.
        </P>
      </Section>
    </Doc>
  );
}
