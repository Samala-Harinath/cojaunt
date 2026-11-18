import type { Metadata } from "next";
import { A, Callout, Doc, List, P, Section, SubHead, Table } from "@/components/legal/prose";
import { brand } from "@/lib/brand";
import { legal } from "@/lib/config";

export const metadata: Metadata = { title: "Privacy Policy", description: `How ${brand.name} collects, uses, shares and protects your personal data.` };

export default function PrivacyPage() {
  return (
    <Doc
      title="Privacy Policy"
      intro={
        <>
          <P>
            {brand.name} helps verified adults in {brand.region} meet through small-group trips, travel buddies and (if they choose) dating. That needs personal information, and some of it is sensitive. This policy
            explains what we collect, why, who can see it, how long we keep it, and the choices you have. We follow India’s Digital Personal Data Protection Act, 2023 (the “DPDP Act”) and the Information
            Technology Act, 2000 and its rules.
          </P>
          <Callout>
            In short: we collect only what the service needs. We never sell your data. Your surname, workplace, area and Instagram stay hidden until you accept someone. Your “open to dating” choice is private. You can
            download or delete your data at any time.
          </Callout>
        </>
      }
    >
      <Section title="1. Who is responsible for your data">
        <P>
          {legal.company} (“we”, “us”) decides why and how your personal data is used, which makes us the “Data Fiduciary” under the DPDP Act.
          {legal.address ? ` Our address is ${legal.address}.` : ""} Questions and requests about your data: <A href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</A>. Complaints: see{" "}
          <A href="/grievance">Grievance Redressal</A>.
        </P>
      </Section>

      <Section title="2. What we collect">
        <Table
          head={["What", "Details", "Where it comes from"]}
          rows={[
            ["Account", "Mobile number, email address, a one-way hash of your password (never the password itself), and a record of the terms and consent you accepted", "You, at sign-up"],
            [
              "Profile",
              "First name, date of birth (only your age is shown), gender, pronouns (optional), relationship status, photos (1 to 6), short bio, work title, interests and travel-style answers",
              "You",
            ],
            ["Private details (optional)", "Surname, workplace, area you live in, Instagram handle. Shown only to people you have connected with", "You"],
            ["Private intent", "Whether you are here for new friends or open to dating. Only you can see this", "You"],
            ["Verification", "Your selfie-check result, and for overnight trips your government ID check result and the verifier’s reference. We do not keep the ID document or the selfie image", "You, through our verification partner"],
            ["Emergency contacts", "Names and phone numbers of people you choose to list", "You"],
            ["Plans and requests", "Trips you view, save, request or book; Sparks and travel requests you send or receive, with their short notes; your host listings", "You and other members"],
            ["Messages", "Chats with connections and plan groups, polls, and reports you file", "You and other members"],
            ["Location", "Your approximate location, rounded to about 1 km, to show people and trips near you. Other members see only your city and a rough distance band. Live location is shared only if you turn it on in Trip Mode, and only with your emergency contacts", "Your device, with your permission"],
            ["Payments", "Amount, status and reference of a payment. Card and UPI details go straight to our payment partner; we never see or store them", "Our payment partner"],
            ["Technical data", "IP address, device and browser type, sign-in attempts, error and security logs", "Automatically"],
          ]}
        />
        <P>We do not collect your contacts list, your precise location in the background, or the content of your device. Photos are re-encoded before saving, which removes hidden camera and GPS data.</P>
      </Section>

      <Section title="3. Why we use it, and on what basis">
        <P>Under the DPDP Act we process your data with your consent, or for a purpose the Act treats as a legitimate use. Each purpose below is separate, and you can withdraw consent for any of them.</P>
        <Table
          head={["Purpose", "Basis"]}
          rows={[
            ["Create and run your account, sign you in, and keep it secure", "Consent given at sign-up"],
            ["Show your profile to others as you have chosen, and match you to trips and people", "Consent"],
            ["Verify that members are real adults, and keep members safe (reports, blocks, scam warnings, SOS)", "Consent; and legitimate use to respond to emergencies and prevent harm"],
            ["Take payments, issue invoices, pay hosts and process refunds", "Consent; and legal obligations (tax and accounting)"],
            ["Send service messages: codes, receipts, request and chat alerts", "Consent"],
            ["Send trip ideas and product news by email", "Separate, optional consent. Untick it any time"],
            ["Fix bugs, prevent fraud and abuse, and keep records the law requires", "Legitimate use and legal obligations"],
            ["Respond to courts, police and other authorities when the law requires it", "Legal obligation"],
          ]}
        />
        <P>We do not use your data to show you third-party advertising, and we do not build advertising profiles.</P>
      </Section>

      <Section title="4. Who can see your information">
        <SubHead>Other members</SubHead>
        <List
          items={[
            "Everyone can see your photos, first name, age, short bio, interests, travel style, verified badge and number of plans completed, subject to your visibility setting.",
            "Your surname, workplace, area and Instagram are shown only to people whose request you accepted (or who accepted yours), and are hidden again if you unfriend them.",
            "Your “open to dating” choice, your relationship-status-based eligibility rules, and who you declined are never shown to anyone. Nobody is told when you mute, unfriend, block or decline them.",
            "Plan attendees’ names are blurred until the host approves you.",
          ]}
        />
        <SubHead>Hosts</SubHead>
        <P>A host sees your first name, photo, age, verification badge and your join note when you ask to join their trip, and the details needed to run the trip once you are approved.</P>
        <SubHead>Your emergency contacts</SubHead>
        <P>Only if you add them and switch on sharing: your trip details and, if you allow it, your live location while a trip is running.</P>
        <SubHead>Our service providers (“processors”)</SubHead>
        <P>We use trusted companies that handle data only on our instructions and under contract. They fall into these groups:</P>
        <List
          items={[
            "Cloud hosting and storage (in India where possible)",
            "SMS and email delivery for codes and notices",
            "Identity and selfie verification",
            "Payments and payouts (for example Razorpay)",
            "Photo and message moderation, to catch nudity, minors and scams",
            "Error monitoring and security tooling",
          ]}
        />
        <SubHead>Authorities and others</SubHead>
        <P>
          We share data with courts, police or regulators when a valid legal request requires it, and to protect someone’s life or safety. If we are involved in a merger or sale, your data may move to the new owner,
          who must honour this policy. We do not sell personal data.
        </P>
      </Section>

      <Section title="5. How long we keep it">
        <Table
          head={["Data", "How long"]}
          rows={[
            ["Account, profile, photos, messages and settings", "While your account is open. Erased within 30 days after you delete it"],
            ["Verification results", "While your account is open, or as long as the verifier’s rules require"],
            ["Payment, invoice and refund records", "As long as tax and accounting law requires"],
            ["Safety reports and the evidence attached to them", "Kept after deletion for as long as needed to protect members and handle legal claims, normally up to 3 years"],
            ["Security and sign-in logs", "At least 180 days, as India’s CERT-In directions require, then deleted"],
            ["Unverified sign-ups", "Deleted after 30 days if the mobile number is never confirmed"],
          ]}
        />
      </Section>

      <Section title="6. Your rights and choices">
        <P>You have these rights under the DPDP Act, and we make them easy to use:</P>
        <List
          items={[
            <>
              <strong>Access.</strong> Download a copy of your data from the Safety centre.
            </>,
            <>
              <strong>Correction and updating.</strong> Edit your profile, photos and private details at any time. Ask us to fix anything you can’t change yourself.
            </>,
            <>
              <strong>Erasure.</strong> Delete your account in Account &amp; security. We erase your data as set out in section 5.
            </>,
            <>
              <strong>Withdraw consent.</strong> Change privacy switches in the Safety centre, turn off marketing emails, or delete your account. Withdrawing consent may stop parts of the service from working.
            </>,
            <>
              <strong>Grievance redressal.</strong> Write to our Grievance Officer (see <A href="/grievance">Grievance Redressal</A>). If we don’t resolve it, you may complain to the Data Protection Board of India.
            </>,
            <>
              <strong>Nominate someone.</strong> You can name a person to exercise your rights if you die or can’t act for yourself. Email <A href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</A>.
            </>,
          ]}
        />
        <P>To protect you, we may ask you to confirm your identity before acting on a request. We aim to reply within 30 days.</P>
      </Section>

      <Section title="7. Sensitive information">
        <P>
          Your gender, relationship status, photos and the fact that you may be open to dating are sensitive. We use them only to run the features you chose: women-only and men-only plans, Singles trips, Sparks and
          safe matching. We don’t use them for anything else, and we don’t share them with advertisers. Please don’t add other sensitive details (health, religion, caste, political views) to your profile or
          messages unless you are comfortable with the person reading them.
        </P>
      </Section>

      <Section title="8. Security">
        <List
          items={[
            "All traffic is encrypted in transit (HTTPS/TLS). Data at rest is encrypted.",
            "Passwords are stored only as salted one-way hashes. Sign-in sessions use secure, HTTP-only cookies that scripts on a page cannot read.",
            "Accounts lock for a while after repeated wrong passwords, and one-time codes expire and allow only a few tries.",
            "Staff access to member data is limited by role, logged and reviewed.",
            "If a personal-data breach happens, we will tell the Data Protection Board of India and the people affected, as the law requires.",
          ]}
        />
        <P>No system is perfectly secure. Use a strong, unique password, don’t share your codes, and sign out on shared devices.</P>
      </Section>

      <Section title="9. Where your data is stored">
        <P>We store member data on servers in India. Some processors may handle limited data (such as email delivery or error reports) from other countries. Where that happens we only use providers bound by contract to protect it, and we follow any restrictions the Government of India places on transfers.</P>
      </Section>

      <Section title="10. Children">
        <P>
          {brand.name} is only for people aged 18 and over. We check your date of birth, and we remove any account we find belongs to someone under 18. If you think a member is under 18, use “Report” on their
          profile or write to <A href={`mailto:${legal.safetyEmail}`}>{legal.safetyEmail}</A>.
        </P>
      </Section>

      <Section title="11. Cookies and similar storage">
        <P>
          We use only the storage the service needs to work: a sign-in cookie, your theme choice, and your saved settings. We use no advertising or tracking cookies. Details are in our <A href="/cookies">Cookies &amp; Storage</A>{" "}
          page.
        </P>
      </Section>

      <Section title="12. Changes to this policy">
        <P>If we change this policy in a way that matters, we will tell you in the app or by email before it takes effect, and ask for your consent again where the law requires it. The date at the top shows the latest version.</P>
      </Section>

      <Section title="13. Contact">
        <P>
          Privacy questions and requests: <A href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</A>. Safety concerns: <A href={`mailto:${legal.safetyEmail}`}>{legal.safetyEmail}</A>. General help:{" "}
          <A href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</A>.
        </P>
      </Section>
    </Doc>
  );
}
