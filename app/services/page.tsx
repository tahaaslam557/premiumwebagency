import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/Button";
import { Footer } from "@/components/footer/Footer";
import { MaskText } from "@/components/motion/MaskText";
import { Navbar } from "@/components/navigation/Navbar";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";
import {
  serviceCategories,
  servicePages,
  tracks,
  type ServiceCategoryKey,
} from "@/data/service-pages";
import { contact, reputation, site } from "@/data/site";

/**
 * Category order, the numbering that goes with it, and a heading for each.
 *
 * The headings are authored here rather than reusing `category.blurb` because
 * <MaskText> masks per authored line: a long sentence with no newlines wraps
 * inside a single mask and slides as one block instead of line by line. The
 * blurb still runs, as the paragraph underneath.
 */
const ORDER: { key: ServiceCategoryKey; heading: string }[] = [
  { key: "engineering", heading: "Built to be\nmaintained." },
  { key: "commerce", heading: "Storefronts that\nsell, not demo." },
  { key: "studio", heading: "Seen, and\nsought out." },
  { key: "apps", heading: "Native surfaces,\nintelligent inside." },
];

const description = `Every service Premium Web Agency offers — ${servicePages.length} engagements across engineering, commerce, design and growth, and apps and AI.`;

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: `${site.url}/services`,
    title: `Services — ${site.name}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Services — ${site.name}`,
    description,
  },
};

export default function ServicesIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Services — ${site.name}`,
        description,
        url: `${site.url}/services`,
      },
      {
        "@type": "ItemList",
        name: "Services",
        numberOfItems: servicePages.length,
        itemListElement: servicePages.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.label,
          url: `${site.url}/services/${service.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
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
          eyebrow="Services"
          title={"Everything we\nbuild, run\nand grow."}
          intro={
            <p>
              {servicePages.length} engagements across four disciplines. Each one has its own
              page: what you get, how the work runs, the stack it sits on, and the questions
              people ask before they commit.
            </p>
          }
          actions={
            <>
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ButtonLink href="/pricing" variant="line" size="lg">
                See pricing
              </ButtonLink>
            </>
          }
          stats={[
            {
              title: `${servicePages.length} services`,
              body: "Every one a real engagement with its own scope, deliverables and process.",
            },
            {
              title: "4 disciplines",
              body: "Engineering, commerce and product, design and growth, apps and AI.",
            },
            {
              title: `${reputation.rating}/${reputation.ratingScale} rated`,
              body: `Across ${reputation.customersServed}+ customers served.`,
            },
          ]}
        />

        {/* ------------------------------------------------- The four groups */}
        {ORDER.map(({ key, heading }, groupIndex) => {
          const category = serviceCategories[key];
          const items = servicePages.filter((service) => service.category === key);

          return (
            <section key={key} className="border-b border-line bg-void py-24 lg:py-32">
              <div className="page">
                <header className="max-w-2xl">
                  <Reveal className="flex items-center gap-4">
                    <span className="label !text-signal-bright">
                      <span className="tabular-nums">
                        {String(groupIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                      {category.label}
                    </span>
                  </Reveal>
                  <MaskText
                    as="h2"
                    text={heading}
                    className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
                  />
                  <Reveal delay={0.1} className="mt-6">
                    <p className="leading-relaxed text-mute">{category.blurb}</p>
                    <p className="mt-3 text-sm text-faint">
                      <span className="tabular-nums">{items.length}</span> services
                    </p>
                  </Reveal>
                </header>

                <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((service, index) => (
                    <Spotlight key={service.slug} className="bg-void">
                      <Link
                        href={`/services/${service.slug}`}
                        data-cursor="explore"
                        data-cursor-label="OPEN"
                        className="group flex h-full flex-col justify-between gap-8 p-8 transition-colors duration-500"
                      >
                        <div>
                          {/* Not `service.eyebrow`: inside the Engineering
                              section all nine of them read "ENGINEERING",
                              directly under a header that just said it. A
                              per-section index carries the same rhythm and
                              never repeats what is above it. */}
                          <span className="label !text-[0.625rem] tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="mt-4 text-[1.0625rem] font-medium leading-snug text-bone">
                            {service.label}
                          </h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mute">
                            {service.summary}
                          </p>
                        </div>
                        <span className="label !text-signal-bright transition-transform duration-500 group-hover:translate-x-1">
                          Open →
                        </span>
                      </Link>
                    </Spotlight>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* ---------------------------------------------------- How work runs */}
        <section className="border-b border-line bg-void py-24 lg:py-32">
          <div className="page">
            <header className="max-w-2xl">
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">05</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  Tracks
                </span>
              </Reveal>
              <MaskText
                as="h2"
                text={"Three ways\nthe work runs."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
              <Reveal delay={0.1} className="mt-6">
                <p className="leading-relaxed text-mute">
                  Every service above runs on one of these. The steps are the same each
                  time — which is the point. You always know what happens next.
                </p>
              </Reveal>
            </header>

            <div className="mt-14 grid gap-px bg-line lg:grid-cols-3">
              {(Object.keys(tracks) as (keyof typeof tracks)[]).map((key) => {
                const track = tracks[key];
                return (
                  <Reveal key={key} className="bg-void p-8">
                    <h3 className="text-[1.0625rem] font-medium leading-snug text-bone">
                      {track.label}
                    </h3>
                    <ol className="mt-7 flex flex-col gap-4">
                      {track.process.map((step) => (
                        <li key={step.index} className="flex items-baseline gap-4">
                          <span className="label !text-faint tabular-nums">{step.index}</span>
                          <span className="text-sm text-bone-dim">{step.title}</span>
                        </li>
                      ))}
                    </ol>
                  </Reveal>
                );
              })}
            </div>
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
                    text={"Not sure which\none you need?"}
                    className="display mt-5 text-[length:var(--text-display-sm)] text-bone"
                  />
                  <Reveal delay={0.1} className="mt-5">
                    <p className="max-w-lg leading-relaxed text-mute">
                      Describe the problem rather than the service. We will come back with
                      scope, timeline and a number — and say so if it is not work we should
                      be doing.
                    </p>
                  </Reveal>
                </div>
                <Reveal delay={0.16} className="flex flex-wrap gap-3">
                  <ButtonLink href="/contact" size="lg">
                    Start a project
                  </ButtonLink>
                  <ButtonLink href={contact.phoneHref} variant="line" size="lg">
                    {contact.phone}
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
