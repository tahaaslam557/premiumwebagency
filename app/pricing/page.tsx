import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { FaqList } from "@/components/services/FaqList";
import { Footer } from "@/components/footer/Footer";
import { MaskText } from "@/components/motion/MaskText";
import { Navbar } from "@/components/navigation/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { PricingTables } from "@/components/pricing/PricingTables";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import { combo, pricing } from "@/data/pricing";
import { contact, guarantees, offer, site } from "@/data/site";

const planCount = pricing.reduce((total, group) => total + group.plans.length, 0);

const description = `Every Premium Web Agency package and its current price — ${planCount} packages across ${pricing.length} categories, with promotional pricing already applied.`;

export const metadata: Metadata = {
  title: "Pricing",
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    url: `${site.url}/pricing`,
    title: `Pricing — ${site.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Pricing — ${site.name}`,
    description,
  },
};

/**
 * How the engagement is priced, stated up front.
 *
 * Every claim below is either in `data/site.ts` or in the terms on file. There
 * are no invented turnaround times, discounts or guarantees on this page — a
 * pricing page is the last place to be approximate.
 */
const principles = [
  {
    title: "The price is the price",
    body: "Every package publishes what it costs and what is in it. Anything a package marks as an optional add-on is quoted separately, before the work starts, not after.",
  },
  {
    title: "Revisions are in the package",
    body: "Each package states its own number of revisions, and you can use all of them. Revised work comes back within 48 hours. You never pay extra because a concept missed.",
  },
  {
    title: "You own the output",
    body: "Full copyright ownership and production-ready files, on every package. Nothing is held back as leverage and nothing needs a licence to keep using.",
  },
  {
    title: "Money-back guarantee",
    body: "Our refund policy is published in full in the terms, including the conditions that apply. Read it before you pay, not after.",
  },
];

const faqs = [
  {
    question: "Are these prices current?",
    answer: offer.active
      ? `Yes. The figures shown are the current promotional prices (${offer.headline}), already applied — the struck-through number beside a package is the original. Prices published here are the ones we honour.`
      : "Yes. The figures shown are the prices we honour for the packages listed.",
  },
  {
    question: "What is not included in a package price?",
    answer:
      "Anything a package explicitly marks as an add-on — mobile responsiveness or a CMS on the smallest web packages, for example — is priced separately and listed on the package itself. Optional add-ons are quoted before work begins.",
  },
  {
    question: "How many revisions do I get?",
    answer:
      "As many as your package states. We keep revising until the work meets the brief, and you are not charged extra when a design concept needs to change. Revised work is delivered within 48 hours.",
  },
  {
    question: "How quickly does work come back?",
    answer:
      "Most design services run on a 48 to 72 hour turnaround per iteration — that is the time for a single stage of a design to come back, not the whole project. A logo request made on a Monday comes back Wednesday; one made on a Friday comes back by end of day Tuesday.",
  },
  {
    question: "Can packages be combined?",
    answer: `Yes. ${combo.name} is ${combo.price} instead of ${combo.was} — ${combo.discount}. ${combo.summary} For anything it does not cover, tell us the scope and we will price that instead.`,
  },
  {
    question: "Can I get a refund?",
    answer:
      "There is a 100% money-back guarantee on our design services, subject to the conditions set out in our terms and conditions. The full policy — what qualifies, what does not, and how to claim — is on the terms page.",
  },
];

export default function PricingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OfferCatalog",
        name: `${site.name} packages`,
        url: `${site.url}/pricing`,
        itemListElement: pricing.map((group) => ({
          "@type": "OfferCatalog",
          name: group.label,
          description: group.tagline,
          itemListElement: group.plans.map((plan) => ({
            "@type": "Offer",
            name: plan.name,
            price: plan.price.replace(/[^0-9.]/g, ""),
            priceCurrency: "USD",
            itemOffered: { "@type": "Service", name: plan.name },
          })),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Pricing", item: `${site.url}/pricing` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Navbar />

      <main id="main">
        <PageHero
          eyebrow="Pricing"
          title={"Priced in\nthe open."}
          intro={
            <p>
              Every package we publish, with what it costs and what is in it.{" "}
              {offer.active ? (
                <span className="text-bone">
                  Promotional pricing ({offer.headline}) is already applied — no code, no
                  countdown.
                </span>
              ) : null}
            </p>
          }
          actions={
            <>
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ButtonLink href={contact.phoneHref} variant="line" size="lg">
                {contact.phone}
              </ButtonLink>
            </>
          }
          stats={[
            {
              title: `${planCount} packages`,
              body: `Across ${pricing.length} categories, from a first site to a full platform.`,
            },
            {
              title: "No hidden line items",
              body: "Optional add-ons are marked on the package and quoted before work starts.",
            },
            {
              title: "Ownership included",
              body: "Full copyright and production-ready files on every package.",
            },
          ]}
        />

        {/* ------------------------------------------------------ Principles */}
        <section className="border-b border-line bg-void py-24 lg:py-32">
          <div className="page">
            <header className="max-w-2xl">
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">01</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  How pricing works
                </span>
              </Reveal>
              <MaskText
                as="h2"
                text={"Four things\nthat do not change."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
            </header>

            <div className="mt-14 grid gap-px bg-line sm:grid-cols-2">
              {principles.map((item, index) => (
                <Reveal key={item.title} className="flex flex-col gap-4 bg-void p-8 lg:p-10">
                  <span className="label !text-faint tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.0625rem] font-medium leading-snug text-bone">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mute">{item.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12 flex flex-wrap gap-2">
              {guarantees.map((guarantee) => (
                <span
                  key={guarantee}
                  className="rounded-full border border-signal/25 bg-signal/[0.05] px-4 py-2 font-mono text-xs text-signal-bright"
                >
                  {guarantee}
                </span>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---------------------------------------------------------- Tables */}
        <section
          id="packages"
          aria-labelledby="packages-heading"
          className="border-b border-line bg-void py-24 lg:py-32"
        >
          <div className="page">
            <header className="max-w-2xl">
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">02</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  Packages
                </span>
              </Reveal>
              <MaskText
                as="h2"
                id="packages-heading"
                text={"Pick the one\nthat fits."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
              <Reveal delay={0.1} className="mt-6">
                <p className="leading-relaxed text-mute">
                  Choose a category, then a package. If none of them is the shape of your
                  project, say so on the contact form and we will price the scope you
                  actually need.
                </p>
              </Reveal>
            </header>

            {/* The same explorer the homepage runs, pointed at the contact
                route: there is no contact section on this page to scroll to. */}
            <PricingTables className="mt-14" contactHref="/contact" />
          </div>
        </section>

        {/* ------------------------------------------------------------ FAQs */}
        <section className="border-b border-line bg-void py-24 lg:py-32">
          <div className="page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <header>
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">03</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  Questions
                </span>
              </Reveal>
              <MaskText
                as="h2"
                text={"Before you\npay anything."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
              <Reveal delay={0.1} className="mt-6">
                <p className="max-w-sm leading-relaxed text-mute">
                  The full refund, revision and turnaround policies are on the terms page.
                  Anything not answered here, our team is on the phone Monday to Friday, 9 AM
                  to 5 PM GMT.
                </p>
                <a
                  href={contact.phoneHref}
                  className="mt-5 inline-block text-lg text-bone transition-colors hover:text-signal-bright"
                >
                  {contact.phone}
                </a>
              </Reveal>
            </header>

            <Reveal delay={0.08}>
              <FaqList faqs={faqs} />
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------------- CTA */}
        <section className="bg-void py-24 lg:py-32">
          <div className="page">
            <Spotlight className="rounded-2xl border border-line" radius={520}>
              <div className="flex flex-col gap-8 p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
                <div>
                  <span className="label !text-signal-bright">Next step</span>
                  <MaskText
                    as="p"
                    text={"None of these\nquite fit?"}
                    className="display mt-5 text-[length:var(--text-display-sm)] text-bone"
                  />
                  <Reveal delay={0.1} className="mt-5">
                    <p className="max-w-lg leading-relaxed text-mute">
                      Packages cover the common shapes. Tell us the scope you actually have
                      and we will come back with a number for it — or point you at the
                      package that already covers it.
                    </p>
                  </Reveal>
                </div>
                <Reveal delay={0.16} className="flex flex-wrap gap-3">
                  <ButtonLink href="/contact" size="lg">
                    Get a quote
                  </ButtonLink>
                  <ButtonLink href="/services" variant="line" size="lg">
                    All services
                  </ButtonLink>
                </Reveal>
              </div>
            </Spotlight>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
