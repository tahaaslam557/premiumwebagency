import type { Metadata } from "next";

import { ButtonLink } from "@/components/ui/Button";
import { ContactFlow } from "@/components/contact/ContactFlow";
import { Footer } from "@/components/footer/Footer";
import { MaskText } from "@/components/motion/MaskText";
import { Navbar } from "@/components/navigation/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import { TracingBeam } from "@/components/ui/TracingBeam";
import { contact, guarantees, reputation, site } from "@/data/site";

const description = `Talk to Premium Web Agency — ${contact.phone}, ${contact.email}, or the project form. Offices in Santa Clara and Dallas.`;

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: `${site.url}/contact`,
    title: `Contact — ${site.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact — ${site.name}`,
    description,
  },
};

/**
 * What happens after the form is sent.
 *
 * Deliberately free of invented response times. The only clock on this page is
 * the one already published elsewhere on the site — phone hours, and the
 * 24-hour designer concept that comes with every engagement.
 */
const steps = [
  {
    index: "01",
    title: "You tell us the problem",
    body: "The form asks for the shape of the work — type, goal, timeline, budget — because those four answers decide almost everything else. Rough numbers are fine; we are scoping, not invoicing.",
  },
  {
    index: "02",
    title: "We come back with scope",
    body: "Scope, timeline and a number, in writing. If a published package already covers it, we say so and point you at the price rather than writing a proposal around it.",
  },
  {
    index: "03",
    title: "You see work quickly",
    body: "Once an engagement starts, a custom designer concept is delivered within 24 hours, and the work runs against a staging environment you can open at any point.",
  },
];

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: `Contact — ${site.name}`,
        description,
        url: `${site.url}/contact`,
      },
      {
        "@type": "ProfessionalService",
        name: site.name,
        url: site.url,
        telephone: contact.phone,
        email: contact.email,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: reputation.rating,
          bestRating: reputation.ratingScale,
          ratingCount: reputation.customersServed,
        },
        address: contact.offices.map((office) => ({
          "@type": "PostalAddress",
          addressLocality: office.city,
          streetAddress: office.address,
          addressCountry: "US",
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: contact.phone,
            email: contact.email,
            availableLanguage: "English",
          },
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: contact.altPhone,
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Contact", item: `${site.url}/contact` },
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
          eyebrow="Contact"
          title={"Let's build\nsomething\nintelligent."}
          intro={
            <p>
              Tell us what you are trying to build and we will come back with scope, timeline
              and a number. If it is not work we should be doing, we will say that instead.
            </p>
          }
          actions={
            <>
              <ButtonLink href={contact.phoneHref} size="lg">
                {contact.phone}
              </ButtonLink>
              <ButtonLink href={contact.emailHref} variant="line" size="lg">
                {contact.email}
              </ButtonLink>
            </>
          }
          stats={[
            {
              title: "Phone, Mon–Fri",
              body: "9 AM to 5 PM GMT, on the number above.",
            },
            {
              title: "Two US offices",
              body: `${contact.offices.map((office) => office.city).join(" and ")}.`,
            },
            {
              title: `${reputation.rating}/${reputation.ratingScale} rated`,
              body: `Across ${reputation.customersServed}+ customers served.`,
            },
          ]}
        />

        {/* ------------------------------------------------- Form and details */}
        <section className="relative overflow-hidden border-b border-line bg-void py-24 lg:py-32">
          <div className="grid-field pointer-events-none absolute inset-0 opacity-40" aria-hidden />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 55% at 12% 15%, color-mix(in oklab, var(--color-signal) 14%, transparent) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="page relative grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">01</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  The brief
                </span>
              </Reveal>

              <MaskText
                as="h2"
                text={"Tell us what\nyou are\nbuilding."}
                className="display mt-8 text-[length:var(--text-display-sm)] text-bone"
              />

              <Reveal delay={0.12} className="mt-9 flex flex-col gap-6">
                <div>
                  <span className="label">Direct line</span>
                  <div className="mt-2 flex flex-col gap-1">
                    <a
                      href={contact.phoneHref}
                      className="w-fit text-xl text-bone transition-colors hover:text-signal-bright"
                    >
                      {contact.phone}
                    </a>
                    <a
                      href={contact.altPhoneHref}
                      className="w-fit text-sm text-mute transition-colors hover:text-bone"
                    >
                      {contact.altPhone}
                    </a>
                    <a
                      href={contact.emailHref}
                      className="w-fit text-sm text-mute transition-colors hover:text-bone"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                <div className="rule" />

                <div className="grid gap-6 sm:grid-cols-2">
                  {contact.offices.map((office) => (
                    <div key={office.city}>
                      <span className="label">{office.city}</span>
                      <p className="mt-2 text-sm leading-relaxed text-bone-dim">
                        {office.address}
                      </p>
                      <p className="label mt-2 !text-faint">{office.coords}</p>
                    </div>
                  ))}
                </div>

                <div className="rule" />

                <ul className="flex flex-wrap gap-2">
                  {guarantees.map((guarantee) => (
                    <li
                      key={guarantee}
                      className="rounded-full border border-line bg-tint/[0.03] px-3 py-1.5 text-xs text-mute"
                    >
                      {guarantee}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={0.08}>
              <ContactFlow />
            </Reveal>
          </div>
        </section>

        {/* --------------------------------------------------- What happens next */}
        <section className="border-b border-line bg-void py-24 lg:py-32">
          <div className="page">
            <header className="max-w-2xl">
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">02</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  What happens next
                </span>
              </Reveal>
              <MaskText
                as="h2"
                text={"No black box\nbetween us."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
            </header>

            <div className="mt-16">
              <TracingBeam>
                <ol className="flex flex-col">
                  {steps.map((step) => (
                    <li
                      key={step.index}
                      className="border-t border-line py-9 first:border-t-0 first:pt-0"
                    >
                      <Reveal className="flex flex-col gap-4 sm:flex-row sm:gap-10">
                        <span className="label !text-faint tabular-nums sm:pt-2">
                          {step.index}
                        </span>
                        <div className="max-w-2xl">
                          <h3 className="display text-[length:var(--text-display-sm)] text-bone">
                            {step.title}
                          </h3>
                          <p className="mt-4 leading-relaxed text-mute">{step.body}</p>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              </TracingBeam>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- CTA */}
        <section className="bg-void py-24 lg:py-32">
          <div className="page">
            <Spotlight className="rounded-2xl border border-line" radius={520}>
              <div className="flex flex-col gap-8 p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
                <div>
                  <span className="label !text-signal-bright">Still deciding</span>
                  <MaskText
                    as="p"
                    text={"Look before\nyou call."}
                    className="display mt-5 text-[length:var(--text-display-sm)] text-bone"
                  />
                  <Reveal delay={0.1} className="mt-5">
                    <p className="max-w-lg leading-relaxed text-mute">
                      Every service has its own page — what you get, how it runs, what it
                      sits on. Every package publishes its price. Neither needs a call
                      first.
                    </p>
                  </Reveal>
                </div>
                <Reveal delay={0.16} className="flex flex-wrap gap-3">
                  <ButtonLink href="/services" size="lg">
                    All services
                  </ButtonLink>
                  <ButtonLink href="/pricing" variant="line" size="lg">
                    See pricing
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
