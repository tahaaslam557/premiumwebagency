import Link from "next/link";

import { BentoCard, BentoGrid } from "@/components/ui/BentoGrid";
import { ButtonLink } from "@/components/ui/Button";
import { FaqList } from "@/components/services/FaqList";
import { Footer } from "@/components/footer/Footer";
import { HeroGrid } from "@/components/hero/HeroGrid";
import { Marquee } from "@/components/ui/Marquee";
import { MaskText } from "@/components/motion/MaskText";
import { Navbar } from "@/components/navigation/Navbar";
import { Reveal } from "@/components/motion/Reveal";
import { Scramble } from "@/components/motion/Scramble";
import { Spotlight } from "@/components/ui/Spotlight";
import { TracingBeam } from "@/components/ui/TracingBeam";
import { contact, guarantees, reputation } from "@/data/site";
import { serviceBySlug, serviceCategories, tracks, type ServicePage as Service } from "@/data/service-pages";

/**
 * The template every service route renders through.
 *
 * It borrows the homepage's chrome and its component vocabulary deliberately —
 * same header, same footer, same interactive grid behind the opener, same
 * masked headings and scrambled labels — so an inner page reads as a deeper
 * part of the same site rather than as a separate microsite. The pieces that
 * are new here (bento grid, tracing beam, marquee, spotlight) each earn their
 * place against one section's job rather than being decoration.
 */
export function ServicePage({ service }: { service: Service }) {
  const track = tracks[service.track];
  const category = serviceCategories[service.category];
  const faqs = [...(service.faqs ?? []), ...track.faqs];
  const related = service.related
    .map((slug) => serviceBySlug.get(slug))
    .filter((item): item is Service => Boolean(item));

  return (
    <>
      <Navbar />

      <main id="main">
        {/* ---------------------------------------------------------- Opener */}
        <section className="relative flex min-h-[78svh] flex-col overflow-hidden border-b border-line bg-void pt-[var(--nav-h)]">
          <HeroGrid />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 85% at 50% 100%, color-mix(in oklab, var(--color-void) 92%, transparent) 0%, color-mix(in oklab, var(--color-void) 45%, transparent) 52%, transparent 82%)",
            }}
            aria-hidden
          />

          <div className="page relative z-10 flex flex-1 flex-col justify-center py-20 lg:py-28">
            <Reveal className="flex flex-wrap items-center gap-4">
              <span className="label !text-signal-bright">
                <Scramble text={service.eyebrow.toUpperCase()} />
              </span>
              <span className="hidden h-px w-12 bg-line sm:block" />
              <Link
                href="/#capabilities"
                className="label transition-colors hover:!text-bone"
              >
                {category.label}
              </Link>
            </Reveal>

            <MaskText
              as="h1"
              text={service.title}
              className="display mt-7 text-[length:var(--text-display-md)] text-bone sm:mt-9"
            />

            <Reveal
              delay={0.12}
              className="mt-8 max-w-2xl text-[1.0625rem] leading-relaxed text-bone-dim"
            >
              <p>{service.summary}</p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/#contact" size="lg">
                Start a project
              </ButtonLink>
              <ButtonLink href="/#pricing" variant="line" size="lg">
                See pricing
              </ButtonLink>
            </Reveal>
          </div>

          {/* Instrument rail, mirroring the homepage hero's footer. */}
          <div className="relative z-10 border-t border-line/70">
            {/* A grid, not a wrapping flex row: the three bodies are different
                lengths, and flex-wrap put the third on a line of its own at
                most widths. Three columns keep them reading as one rail. */}
            <div className="page grid gap-6 py-6 sm:grid-cols-3 sm:gap-10">
              {service.highlights.map((highlight) => (
                <Reveal key={highlight.title} className="flex flex-col gap-1.5">
                  <span className="font-mono text-sm text-bone">{highlight.title}</span>
                  <span className="text-xs leading-relaxed text-mute">{highlight.body}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- Deliverables */}
        <section className="border-b border-line bg-void py-24 lg:py-32">
          <div className="page">
            <header className="max-w-2xl">
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">01</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  What you get
                </span>
              </Reveal>
              <MaskText
                as="h2"
                text={"Everything the\nengagement includes."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
            </header>

            {/* Six deliverables per service, always — which divides evenly by
                1, 2 and 3, so the grid tiles cleanly at every breakpoint. An
                earlier pass spanned the first card across two columns and left
                two empty cells showing the grid's own background as a grey
                slab in the corner. Uniform cards, no hole. */}
            <Reveal className="mt-14">
              <BentoGrid>
                {service.deliverables.map((item, index) => (
                  <BentoCard
                    key={item.name}
                    name={item.name}
                    description={item.description}
                    index={String(index + 1).padStart(2, "0")}
                  />
                ))}
              </BentoGrid>
            </Reveal>
          </div>
        </section>

        {/* --------------------------------------------------------- Process */}
        <section className="border-b border-line bg-void py-24 lg:py-32">
          <div className="page">
            <header className="max-w-2xl">
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">02</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  {track.label}
                </span>
              </Reveal>
              <MaskText
                as="h2"
                text={"Run in order,\nevery time."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
            </header>

            <div className="mt-16">
              <TracingBeam>
                <ol className="flex flex-col">
                  {track.process.map((step) => (
                    <li key={step.index} className="border-t border-line py-9 first:border-t-0 first:pt-0">
                      <Reveal className="flex flex-col gap-4 sm:flex-row sm:gap-10">
                        <span className="label !text-faint tabular-nums sm:pt-2">{step.index}</span>
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

        {/* ----------------------------------------------------------- Stack */}
        <section className="relative border-b border-line bg-void py-24 lg:py-32">
          <div className="page">
            <header className="max-w-2xl">
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">03</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  Stack
                </span>
              </Reveal>
              <MaskText
                as="h2"
                text={"What it runs on."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
              <Reveal delay={0.1} className="mt-6">
                <p className="leading-relaxed text-mute">
                  Chosen for maintenance and for your team, not for novelty. Where an
                  existing stack of yours makes more sense, we work in that instead.
                </p>
              </Reveal>
            </header>
          </div>

          {/* Full-bleed: the rail should run off both edges of the page. */}
          <Reveal className="relative mt-14">
            <Marquee pauseOnHover className="[--duration:44s] [--gap:0.75rem]">
              {service.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line bg-tint/[0.03] px-5 py-2.5 font-mono text-xs whitespace-nowrap text-mute"
                >
                  {item}
                </span>
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="mt-3 [--duration:52s] [--gap:0.75rem]">
              {guarantees.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-signal/25 bg-signal/[0.05] px-5 py-2.5 font-mono text-xs whitespace-nowrap text-signal-bright"
                >
                  {item}
                </span>
              ))}
            </Marquee>

            {/* Fade the rail into the page rather than cutting it off. */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-void) 0%, transparent 100%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40"
              style={{
                background:
                  "linear-gradient(270deg, var(--color-void) 0%, transparent 100%)",
              }}
              aria-hidden
            />
          </Reveal>
        </section>

        {/* ------------------------------------------------------------ FAQs */}
        <section className="border-b border-line bg-void py-24 lg:py-32">
          <div className="page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <header>
              <Reveal className="flex items-center gap-4">
                <span className="label !text-signal-bright">
                  <span className="tabular-nums">04</span>
                  <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                  Questions
                </span>
              </Reveal>
              <MaskText
                as="h2"
                text={"Before you\nask us."}
                className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
              />
              <Reveal delay={0.1} className="mt-6">
                <p className="max-w-sm leading-relaxed text-mute">
                  Anything not answered here, our team is on the phone Monday to Friday,
                  9 AM to 5 PM GMT.
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

        {/* --------------------------------------------------------- Related */}
        {related.length ? (
          <section className="border-b border-line bg-void py-24 lg:py-32">
            <div className="page">
              <header className="max-w-2xl">
                <Reveal className="flex items-center gap-4">
                  <span className="label !text-signal-bright">
                    <span className="tabular-nums">05</span>
                    <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
                    Adjacent
                  </span>
                </Reveal>
                <MaskText
                  as="h2"
                  text={"Usually bought\nalongside."}
                  className="display mt-7 text-[length:var(--text-display-sm)] text-bone"
                />
              </header>

              <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <Spotlight key={item.slug} className="bg-void">
                    <Link
                      href={`/services/${item.slug}`}
                      data-cursor="explore"
                      data-cursor-label="OPEN"
                      className="group flex h-full flex-col justify-between gap-8 p-8 transition-colors duration-500"
                    >
                      <div>
                        <span className="label !text-[0.625rem]">
                          {serviceCategories[item.category].label}
                        </span>
                        <h3 className="mt-4 text-[1.0625rem] font-medium leading-snug text-bone">
                          {item.label}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mute">
                          {item.summary}
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
        ) : null}

        {/* ------------------------------------------------------------- CTA */}
        <section className="bg-void py-24 lg:py-32">
          <div className="page">
            <Spotlight className="rounded-2xl border border-line" radius={520}>
              <div className="flex flex-col gap-8 p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
                <div>
                  <span className="label !text-signal-bright">Next step</span>
                  {/* Not `label.toLowerCase()`. Thirty-four labels pass through
                      this line and a good number carry an acronym — that turned
                      "SEO Marketing" into "seo marketing", and "AR/VR" and
                      "UX & UI" fare worse. The heading stays label-free; the
                      service is named in the sentence below, where "your
                      {label} project" is grammatical for all thirty-four. */}
                  <MaskText
                    as="p"
                    text={"Let's scope\nyour project."}
                    className="display mt-5 text-[length:var(--text-display-sm)] text-bone"
                  />
                  <Reveal delay={0.1} className="mt-5">
                    <p className="max-w-lg leading-relaxed text-mute">
                      Rated {reputation.rating}/{reputation.ratingScale} across{" "}
                      {reputation.customersServed}+ customers served. Tell us about your{" "}
                      {service.label} project and we will come back with scope, timeline
                      and a number.
                    </p>
                  </Reveal>
                </div>
                <Reveal delay={0.16} className="flex flex-wrap gap-3">
                  <ButtonLink href="/#contact" size="lg">
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
