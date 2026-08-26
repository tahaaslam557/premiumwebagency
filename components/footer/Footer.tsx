"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { FooterWordmark } from "./FooterWordmark";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { footerColumns, legalLinks, navigation } from "@/data/navigation";
import { contact, site, socials } from "@/data/site";
import { sectionHref } from "@/lib/utils";

/** Final system screen: statement, index, contact, legal, live status. */
export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-void">
      <div className="page pt-24 lg:pt-32">
        <MaskText
          as="p"
          text={"Intelligence,\nbuilt beautifully."}
          className="display text-[length:var(--text-display-lg)] text-bone"
        />

        <div className="rule mt-16" />

        <div className="grid gap-12 py-16 lg:grid-cols-[1.1fr_2.4fr]">
          <div className="flex flex-col gap-7">
            <Image
              src="/brand/logo-dark.webp"
              alt={site.name}
              width={500}
              height={170}
              loading="lazy"
              // self-start: in a column flex the default `align-items: stretch`
              // overrides `w-auto` and smears the logo across the column.
              className="on-dark h-7 w-auto self-start"
            />
            <Image
              src="/brand/logo.webp"
              alt=""
              aria-hidden="true"
              width={500}
              height={170}
              loading="lazy"
              className="on-light h-7 w-auto self-start"
            />
            <p className="max-w-xs text-sm leading-relaxed text-mute">{site.description}</p>

            <div className="flex flex-col gap-1">
              <a
                href={contact.phoneHref}
                className="w-fit text-lg text-bone transition-colors hover:text-signal-bright"
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

            <ul className="flex flex-wrap gap-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    data-cursor="action"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-line font-mono text-[0.625rem] text-mute transition-colors hover:border-signal-bright hover:text-bone"
                  >
                    {social.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="label !text-bone">{column.title}</h2>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={sectionHref(link.href, pathname)}
                        className="text-sm text-mute transition-colors hover:text-bone"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="rule" />

        <div className="grid gap-8 py-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <nav aria-label="Sections" className="flex flex-wrap gap-x-6 gap-y-2">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={sectionHref(item.href, pathname)}
                className="label transition-colors hover:!text-bone"
              >
                <span className="!text-faint">{item.index}</span> {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 lg:items-end">
            {contact.offices.map((office) => (
              <p key={office.city} className="text-xs text-faint">
                {office.address}
              </p>
            ))}
          </div>
        </div>

        <div className="rule" />

        <Reveal className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-faint transition-colors hover:text-bone-dim"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <LiveStatus />
        </Reveal>
      </div>

      {/* Outside `.page` on purpose: the wordmark runs the full width of the
          viewport, not the width of the content grid. */}
      <FooterWordmark />
    </footer>
  );
}

/**
 * Ticking system readout. Rendered empty on the server and filled after mount,
 * because a clock is the one thing guaranteed to mismatch during hydration.
 */
function LiveStatus() {
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const update = () =>
      setClock(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Los_Angeles",
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className="flex items-center gap-2.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-bright" />
      </span>
      <span className="label !text-[0.625rem]">
        System online
        {clock ? <span className="ml-2 tabular-nums text-mute">{clock} PT</span> : null}
      </span>
    </p>
  );
}
