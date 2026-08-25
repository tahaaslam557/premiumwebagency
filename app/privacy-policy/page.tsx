import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Minim-L LLC, including RightClixs and Premium Web Agency, collects, uses, protects and discloses information obtained from users of its services.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      index="09"
      eyebrow="Legal / Privacy"
      title={"Privacy\npolicy."}
      intro="What we collect, why we hold it, who can see it, and how to ask us to let it go."
      updated="10-05-2024"
      current="/privacy-policy"
    >
      <div className="legal-prose">
        <p>
          This Privacy Policy (&ldquo;Policy&rdquo;) describes how Minim-L LLC, including its
          affiliated brands RightClixs and Premium Web Agency (collectively referred to as
          &ldquo;Minim-L,&rdquo; &ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;), collects, uses, maintains, protects, and discloses information
          obtained from users (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;)
          who access or use our websites, platforms, products, and services (collectively, the
          &ldquo;Services&rdquo;).
        </p>
        <p>
          Minim-L is a Texas-based company operating under the laws of the United States of
          America. By accessing or using our Services, you acknowledge that you have read,
          understood, and agreed to the practices described in this Policy. If you do not
          agree, you must discontinue use of our Services.
        </p>

        <h2>1. Interpretation &amp; definitions</h2>
        <ul>
          <li>
            <strong>Account:</strong> A registered profile created to access certain Services.
          </li>
          <li>
            <strong>Company:</strong> Minim-L LLC, including its brands RightClixs and Premium
            Web.
          </li>
          <li>
            <strong>Personal Data:</strong> Any information that identifies, relates to, or can
            reasonably be linked to an identifiable individual.
          </li>
          <li>
            <strong>Usage Data:</strong> Data collected automatically when using the Services.
          </li>
          <li>
            <strong>Service Providers:</strong> Third parties engaged to perform services on
            our behalf.
          </li>
          <li>
            <strong>Device:</strong> Any electronic device used to access the Services.
          </li>
          <li>
            <strong>Country / Governing Jurisdiction:</strong> United States of America (State
            of Texas).
          </li>
        </ul>

        <h2>2. Information we collect</h2>
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>
            <em>2.1 Personal Identifiable Information (PII)</em> — including but not limited to
            full name, email address, phone number, business name, billing and mailing address.
          </li>
          <li>
            <em>2.2 Account &amp; Business Information</em> — login credentials, project briefs,
            contracts, invoices, and correspondence, CRM records.
          </li>
          <li>
            <em>2.3 Technical &amp; Usage Information</em> — IP address, browser type and
            version, device identifiers, pages visited, session duration, and interaction data.
          </li>
          <li>
            <em>2.4 Payment &amp; Transaction Information</em> — payments are processed securely
            through third-party payment processors. We do not store full credit card or banking
            details on our servers.
          </li>
          <li>
            <em>2.5 Communications Data</em> — emails, call recordings (where legally
            permitted), AI-generated transcripts, SMS opt-in records, support chats and tickets.
          </li>
        </ul>

        <h2>3. How we use your information</h2>
        <p>
          We use collected data for legitimate business purposes, including but not limited to:
          providing, operating, and delivering Services; processing transactions and payments;
          client onboarding and project execution; customer support and dispute resolution;
          internal reporting, analytics, and performance monitoring; legal compliance and
          enforcement of agreements; marketing communications (only where lawful consent is
          provided).
        </p>

        <h2>4. SMS communications &amp; consent</h2>
        <p>
          If you opt in to receive SMS or text communications from Minim-L: you may receive
          service updates, order notifications, reminders, or promotional messages; message
          frequency may vary; message and data rates may apply; you may opt out at any time by
          replying STOP; for assistance, reply HELP or contact{" "}
          <a href="mailto:support@minim-l.com">support@minim-l.com</a>. We do not sell, rent, or
          share phone numbers collected for SMS communications with third parties for marketing
          purposes.
        </p>

        <h2>5. Data protection, confidentiality &amp; workforce privacy</h2>
        <p>
          Minim-L implements commercially reasonable administrative, technical, and
          organizational safeguards to protect client data against unauthorized access,
          disclosure, alteration, or destruction.
        </p>
        <ul>
          <li>
            <em>5.1 Restricted Access Controls</em> — Client data is accessible strictly on a
            role-based, need-to-know basis. Employees, contractors, and service providers are
            granted access only to the extent necessary to perform their assigned
            responsibilities.
          </li>
          <li>
            <em>5.2 Workforce Privacy &amp; Identity Protection</em> — To enhance security and
            maintain professional boundaries, Minim-L does not disclose the personal identities,
            photographs, private contact details, or internal profiles of its employees,
            contractors, or outsourced professionals to clients, unless required by law or
            contract. All personnel are bound by confidentiality obligations and internal data
            security policies.
          </li>
          <li>
            <em>5.3 Outsourcing &amp; Resource Utilization</em> — To ensure service quality and
            client satisfaction, Minim-L may engage qualified third-party or outsourced
            resources, operating under strict confidentiality agreements and security standards
            consistent with this Policy. We may utilize a combination of local and international
            personnel, contractors, and service providers to support service delivery. Access to
            client information is strictly controlled and limited to individuals whose
            involvement is reasonably necessary. For security and confidentiality purposes,
            individual employee identities, internal team structures, or operational resource
            details are not disclosed to clients. All such practices are conducted in accordance
            with applicable data protection standards and this Privacy Policy.
          </li>
        </ul>

        <h2>6. Sharing of information</h2>
        <p>
          We may share your information only: within the Minim-L corporate group; with trusted
          service providers (hosting, CRM, analytics, payments); for legal compliance, court
          orders, or regulatory requirements; during business transfers (mergers, acquisitions,
          asset sales). We do not sell personal data.
        </p>

        <h2>7. Data retention</h2>
        <p>
          We retain Personal Data only for as long as necessary to fulfill business purposes,
          comply with legal obligations, resolve disputes, and enforce agreements. You may
          request deletion subject to legal and contractual limitations.
        </p>

        <h2>8. Your privacy rights</h2>
        <p>
          Depending on jurisdiction, you may have the right to access your Personal Data,
          request correction or deletion, withdraw marketing consent, or limit processing of
          sensitive data. Requests can be submitted to{" "}
          <a href="mailto:privacy@minim-l.com">privacy@minim-l.com</a>.
        </p>

        <h2>9. Security disclaimer</h2>
        <p>
          While we employ industry-standard safeguards, no method of data transmission or
          storage is 100% secure. We do not guarantee absolute security and disclaim liability
          for unauthorized access beyond reasonable control.
        </p>

        <h2>10. Children&rsquo;s privacy</h2>
        <p>
          Our Services are not intended for individuals under 13 years of age. We do not
          knowingly collect data from children.
        </p>

        <h2>11. Third-party links</h2>
        <p>
          We are not responsible for the privacy practices of third-party websites linked from
          our Services.
        </p>

        <h2>12. International data transfers</h2>
        <p>
          All data is processed in the United States. By using our Services, you consent to the
          transfer and processing of your information under U.S. law.
        </p>

        <h2>13. Governing law &amp; jurisdiction</h2>
        <p>
          This Policy shall be governed by and construed in accordance with the laws of the
          State of Texas. Any disputes shall be resolved exclusively in the state or federal
          courts located in Texas.
        </p>

        <h2>14. Changes to this policy</h2>
        <p>
          We reserve the right to modify this Policy at any time. Updates will be reflected by
          the &ldquo;Last Updated&rdquo; date.
        </p>
      </div>
    </LegalPage>
  );
}
