import type { Metadata } from "next";
import { A, Callout, Doc, List, P, Section } from "@/components/legal/prose";
import { brand } from "@/lib/brand";
import { legal } from "@/lib/config";

export const metadata: Metadata = { title: "Terms of Service", description: `The rules for using ${brand.name}.` };

export default function TermsPage() {
  return (
    <Doc
      title="Terms of Service"
      intro={
        <>
          <P>
            These Terms are an agreement between you and {legal.company} (“we”, “us”) about your use of {brand.name}, including our website, apps and services. By creating an account you confirm that you have read and
            accepted them, together with our <A href="/privacy">Privacy Policy</A>, <A href="/community-guidelines">Community Guidelines</A> and <A href="/refunds">Refunds &amp; Cancellations</A>.
          </P>
          <Callout>
            Meeting people always carries some risk. {brand.name} gives you tools to stay safe, but we can’t control what members do. Please read the safety sections and use your own judgement.
          </Callout>
        </>
      }
    >
      <Section title="1. Who can use Cojaunt">
        <List
          items={[
            "You must be 18 or older and legally able to enter a contract in India. We may ask for proof of age.",
            "You must give true information about yourself, including your age, gender and relationship status, and keep it up to date. One person may hold one account.",
            "Sparks, “Open to dating” and Singles trips are only for members who are single. Married members can use travel buddies and Group trips.",
            "You can’t use the service if you have been banned from it, are barred by law from using it, or have been convicted of a sexual offence or a crime of violence.",
          ]}
        />
      </Section>

      <Section title="2. Your account and security">
        <List
          items={[
            "You are responsible for everything done through your account. Keep your password and one-time codes secret, and don’t share your account.",
            "Tell us straight away at the safety address below if you think someone else has used your account.",
            "We may require re-verification (a selfie check, or a government ID check for overnight trips) at any time. Members who don’t pass can’t send requests.",
            "We keep the result of verification, not your ID document or selfie.",
          ]}
        />
      </Section>

      <Section title="3. What Cojaunt does, and doesn’t do">
        <P>
          {brand.name} is an online platform. It lets members discover each other and hosted plans, send Sparks and travel requests, chat once both sides agree, and book seats on trips run by independent hosts. We are an
          intermediary under the Information Technology Act, 2000.
        </P>
        <List
          items={[
            "We do not run the trips ourselves unless a plan says so. Hosts are independent and are responsible for the plans they run.",
            "We do not promise that you will meet anyone, form a relationship, or enjoy a trip.",
            "Verification and moderation reduce risk but can’t remove it. A verified badge is not a background check or a guarantee of character.",
            "Features such as match explanations and search are tools that help you decide. They are not advice, and they never write messages or photos for you.",
          ]}
        />
      </Section>

      <Section title="4. How members must behave">
        <P>Everything in our Community Guidelines applies. In particular, you agree not to:</P>
        <List
          items={[
            "harass, threaten, pressure, stalk or discriminate against anyone, or send sexual content nobody asked for;",
            "pretend to be someone else, use another person’s photos, or create fake or duplicate accounts;",
            "ask for money, UPI details, investments or gifts, or take payment for a trip outside the app;",
            "share someone’s private details, photos or messages without their consent;",
            "advertise, recruit, run a business or sell anything through the service without our permission;",
            "post anything illegal, hateful, violent, or showing a person under 18;",
            "scrape the service, probe it for weaknesses, send automated requests or interfere with how it works;",
            "use the service for anything that breaks the law, including laws on trafficking, escort or sexual services.",
          ]}
        />
        <P>We may remove content, limit features, suspend or end accounts, and report conduct to the authorities if we think these rules or the law have been broken.</P>
      </Section>

      <Section title="5. Hosts and trips">
        <List
          items={[
            "Anyone who creates a plan is a host. Hosts must be verified, give accurate details, follow the host pledges shown when they create a plan, and have all permits, licences and insurance the activity needs.",
            "Plans are reviewed before they appear, but we can’t inspect every plan or vehicle, stay or activity. You decide whether a plan is right for you.",
            "Group trips are open to everyone unless marked women-only or men-only. Singles trips are only for single members who are open to dating, are always mixed, and keep guests within a 12-year age band.",
            "A host may approve or decline requests to join. A request is not a booking until it is approved and paid for.",
            "Hosts may cancel or change a plan. If a host cancels, you get a full refund (see Refunds & Cancellations).",
          ]}
        />
      </Section>

      <Section title="6. Payments, fees and tax">
        <List
          items={[
            "Prices are shown in Indian rupees. The checkout screen shows the seat price, our platform fee and taxes (such as GST) before you pay.",
            "Seats are paid for inside the app. Your payment is held until the plan has happened and then released to the host after our commission. Never pay a host or member outside the app.",
            "Payments are processed by our payment partner. We never see or store your full card or UPI details.",
            "Refunds follow the cancellation rules shown on the plan and in our Refunds & Cancellations page.",
            "Hosts are responsible for the taxes on what they earn. We may deduct tax at source where the law requires.",
          ]}
        />
      </Section>

      <Section title="7. Plus membership">
        <P>
          Plus is an optional paid plan that removes the platform fee and adds extra features. Safety features are always free. Plus renews only if you choose a renewing plan, and you can cancel at any time; access
          continues until the end of the period you paid for. Prices and benefits can change for future periods with notice.
        </P>
      </Section>

      <Section title="8. Your content">
        <List
          items={[
            "You own the photos, text and other content you post. You give us a limited, worldwide, non-exclusive licence to host, display and process it to run the service and keep members safe.",
            "You promise you have the right to post it, and that it doesn’t break anyone’s rights or the law.",
            "We may remove content that breaks these Terms. We use automated checks and human review to find nudity, minors, scams and abuse.",
            "When you delete content or your account, we remove it as described in the Privacy Policy. Reports and what the law requires us to keep may stay.",
          ]}
        />
      </Section>

      <Section title="9. Safety, and your responsibility">
        <List
          items={[
            "Meet new people in public, tell a friend where you’ll be, and prefer group plans for a first meeting.",
            "Trips and activities, especially treks, water sports and overnight stays, can be dangerous. You take part at your own risk and must follow the host’s safety instructions, local laws and your own limits.",
            "Use Trip Mode, SOS, block and report whenever you need them. In an emergency, call 112 first.",
            "Don’t rely on us to check a member’s history. We can’t guarantee anyone’s identity, intentions or behaviour.",
          ]}
        />
      </Section>

      <Section title="10. Suspension and ending your account">
        <P>
          You can delete your account at any time in Account &amp; security. We may suspend or end your account, with or without notice, if you break these Terms, put others at risk, or the law requires it. If we do,
          we will tell you why where we are allowed to, and you can appeal by writing to <A href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</A>.
        </P>
      </Section>

      <Section title="11. Our rights in the service">
        <P>The service, its design, software, name and logo belong to us or our licensors. You may use them only as these Terms allow. Please send us feedback; we may use it without owing you anything.</P>
      </Section>

      <Section title="12. Disclaimers">
        <P>
          The service is provided “as is” and “as available”. To the extent the law allows, we do not promise that it will always work, be error-free or secure, or that members or hosts will behave as described.
          Nothing in these Terms limits any right you have under the Consumer Protection Act, 2019 or other law that cannot be excluded.
        </P>
      </Section>

      <Section title="13. Limit on our liability">
        <P>
          To the extent the law allows, we are not liable for indirect or consequential loss, for loss caused by other members, hosts or third parties, or for events outside our control. Our total liability to you
          for any claim about the service is limited to the amount you paid us in the 12 months before the claim, or ₹5,000 if that is higher. This does not limit liability for death or personal injury caused by our
          negligence, for fraud, or for anything the law says can’t be limited.
        </P>
      </Section>

      <Section title="14. You agree to cover harm you cause">
        <P>If your breach of these Terms or the law causes a claim or loss to us, you agree to compensate us for it, to the extent the law allows.</P>
      </Section>

      <Section title="15. Changes to the service and these Terms">
        <P>
          We may change the service or these Terms. For changes that matter, we will give you reasonable notice in the app or by email. If you keep using {brand.name} after the change takes effect, you accept it. If
          you don’t agree, delete your account before then.
        </P>
      </Section>

      <Section title="16. Governing law and disputes">
        <P>
          These Terms are governed by the laws of India. Courts at {legal.jurisdiction} have exclusive jurisdiction, subject to any right you have to bring a consumer complaint before a consumer commission where you
          live. Please write to our <A href="/grievance">Grievance Officer</A> first, so we can try to settle it.
        </P>
      </Section>

      <Section title="17. Contact">
        <P>
          Questions: <A href={`mailto:${legal.supportEmail}`}>{legal.supportEmail}</A>. Safety: <A href={`mailto:${legal.safetyEmail}`}>{legal.safetyEmail}</A>.
        </P>
      </Section>
    </Doc>
  );
}
