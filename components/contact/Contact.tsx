"use client";

import { ContactFlow } from "./ContactFlow";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { contact, guarantees } from "@/data/site";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-line bg-void py-28 lg:py-36"
    >
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
              <span className="tabular-nums">11</span>
              <span className="mx-4 inline-block h-px w-10 bg-signal/50 align-middle" />
              Contact
            </span>
          </Reveal>

          <MaskText
            as="h2"
            id="contact-heading"
            text={"Let's build\nsomething\nintelligent."}
            className="display mt-8 text-[length:var(--text-display-md)] text-bone"
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
                  <p className="mt-2 text-sm leading-relaxed text-bone-dim">{office.address}</p>
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
  );
}
