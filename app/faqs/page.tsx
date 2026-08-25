import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to the questions we are asked most often — why an online presence matters, what a website costs, who we work with and how long a build takes.",
  alternates: { canonical: "/faqs" },
};

const faqs = [
  {
    question: "Why is having a website or an online presence important for your business?",
    answer:
      "When you have a business, you need a website. It’s important because it’s your connection to the world—the way that anyone in the world can have access and have that moment of exchange and communication with what you’re doing.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "The cost of a website can vary depending on various factors, just like the cost of a house may vary. Business sites and range depend on your unique needs. Please see our affordable pricing and plan.",
  },
  {
    question: "What kind of businesses do you work with?",
    answer:
      "We work with a broad range of company types (small start-ups, large corporations, nonprofits, B2B, B2C and more) across many business industries (technology, food, apparel, health + beauty, camps, travel, finance, arts, fair trade, and more).",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Our standard websites take approximately 120 days to create. Our E-commerce (online store) websites take approximately 160 days to create. This time will vary from project to project.",
  },
];

/** Structured data: the same four answers, in the form search engines read. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LegalPage
        index="07"
        eyebrow="Reference / FAQs"
        title={"A few frequently\nasked questions."}
        intro="The things people ask before they start. If yours isn't here, the fastest answer is a call."
        current="/faqs"
      >
        <dl className="legal-faq">
          {faqs.map((item) => (
            <div key={item.question} className="py-8 first:pt-0">
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </LegalPage>
    </>
  );
}
