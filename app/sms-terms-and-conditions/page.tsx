import Link from "next/link";
import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "SMS Terms and Conditions",
  description:
    "How Premium Web Agency uses SMS — what we send, how often, how to opt in, how to opt out, and what it may cost you.",
  alternates: { canonical: "/sms-terms-and-conditions" },
};

export default function SmsTermsPage() {
  return (
    <LegalPage
      index="10"
      eyebrow="Legal / SMS"
      title={"SMS terms and\nconditions."}
      intro="What you agree to when you tick the SMS box — and how to untick it at any time."
      current="/sms-terms-and-conditions"
    >
      <div className="legal-prose">
        <h2>SMS consent communication</h2>
        <p>
          Premium Web Agency respects your privacy. Any phone number obtained as part of the SMS
          consent process will be used solely for communication purposes and will not be shared
          with third parties for marketing.
        </p>

        <h2>Types of SMS communications</h2>
        <p>
          By opting in to receive SMS messages from Premium Web Agency, you agree to receive
          text messages related to your account or project. These communications may include
          appointment reminders, follow-up messages, billing inquiries, and promotions or
          special offers (if applicable).
        </p>
        <p>
          <em>
            Example message: &ldquo;Hello, this is [NAME] from Premium Web Agency. We welcome
            you on board! Reply STOP to opt out of SMS messaging at any time.&rdquo;
          </em>
        </p>

        <h2>Message frequency</h2>
        <p>
          The frequency of SMS messages may vary based on your interaction with Premium Web
          Agency. Depending on your project or service, you may receive up to 2–5 messages per
          week.
        </p>
        <p>
          <em>
            Example message: &ldquo;Message frequency may vary. You may receive up to 2-5 SMS
            messages per week regarding your project status.&rdquo;
          </em>
        </p>

        <h2>Potential fees for SMS messaging</h2>
        <p>
          Standard message and data rates may apply based on your mobile carrier&rsquo;s pricing
          plan. These fees may vary depending on whether the message is sent domestically or
          internationally.
        </p>

        <h2>Opt-in method</h2>
        <p>
          You can opt in to receive SMS communications from Premium Web Agency by submitting an
          online form or filling out a paper form.
        </p>

        <h2>Opt-out method</h2>
        <p>
          You can opt out of receiving SMS messages at any time by replying with the keyword
          &ldquo;STOP&rdquo; to any message you receive from Premium Web Agency. Alternatively,
          you may contact us directly to request removal from our messaging list.
        </p>

        <h2>Help and support</h2>
        <p>
          If you encounter any issues with SMS communications, you can reply with the keyword
          &ldquo;HELP&rdquo; for assistance, or reach us through our website&rsquo;s{" "}
          <Link href="/#contact">Contact Us</Link> page.
        </p>

        <h2>Standard messaging disclosures</h2>
        <p>
          Standard message and data rates may apply. You can opt out at any time by texting
          &ldquo;STOP.&rdquo; For assistance, text &ldquo;HELP&rdquo; or visit our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
          <Link href="/terms-and-conditions">Terms and Conditions</Link> pages.
        </p>

        <h2>Additional options</h2>
        <p>
          If you prefer not to receive SMS communications, please ensure you do not check the
          SMS consent box on any of our forms. SMS frequency may vary depending on your
          engagement with our services.
        </p>
      </div>
    </LegalPage>
  );
}
