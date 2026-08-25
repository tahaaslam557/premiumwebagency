"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { ButtonLink } from "@/components/ui/Button";
import { LampThemeToggle } from "@/components/theme/LampThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { EASE } from "@/lib/constants";
import { useScrollY } from "@/lib/hooks";
import { cn, sectionHref } from "@/lib/utils";
import { navigation } from "@/data/navigation";
import { contact, site } from "@/data/site";

/**
 * Floating navigation. Transparent over the hero, glass once scrolled, and it
 * tracks the section currently under the fold so the user always knows where
 * they are in the document.
 */
export function Navbar() {
  const pathname = usePathname();
  const scrollY = useScrollY();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const condensed = scrollY > 40;

  useEffect(() => {
    const sections = navigation
      .map((item) => document.querySelector(item.href))
      .filter((node): node is Element => Boolean(node));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-[background-color,backdrop-filter,border-color] duration-500",
          condensed ? "glass border-b border-line" : "border-b border-transparent",
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE.outExpo }}
        style={{ ["--nav-h" as string]: condensed ? "3.75rem" : "4.5rem" }}
      >
        <div
          // The lamp measures this element to find the content grid's right
          // edge; see `--lamp-right`.
          data-page-edge=""
          className="page flex items-center justify-between transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ height: "var(--nav-h)" }}
        >
          <a href={sectionHref("#hero", pathname)} aria-label={`${site.name} — home`} className="flex items-center gap-3">
            {/* Two marks, one alt text. The `-dark` file is the mark recoloured
                for dark grounds; the original is drawn in near-black ink and
                belongs on paper. Swapped in CSS rather than in state so the
                correct one is already showing on the frame the theme flips. */}
            <Image
              src="/brand/logo-dark.webp"
              alt={site.name}
              width={500}
              height={170}
              priority
              className={cn(
                "on-dark w-auto transition-[height] duration-500",
                condensed ? "h-6" : "h-7",
              )}
            />
            <Image
              src="/brand/logo.webp"
              alt=""
              aria-hidden="true"
              width={500}
              height={170}
              loading="eager"
              className={cn(
                "on-light w-auto transition-[height] duration-500",
                condensed ? "h-6" : "h-7",
              )}
            />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={sectionHref(item.href, pathname)}
                className={cn(
                  "group relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                  active === item.href ? "text-bone" : "text-mute hover:text-bone",
                )}
              >
                {active === item.href ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-tint/[0.06]"
                    transition={{ duration: 0.5, ease: EASE.outExpo }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 xl:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-bright" />
              </span>
              <span className="label !text-[0.625rem]">Online</span>
            </span>

            <a
              href={contact.phoneHref}
              className="hidden font-mono text-xs text-bone-dim transition-colors hover:text-bone md:block"
            >
              {contact.phone}
            </a>

            <ButtonLink href={sectionHref("#contact", pathname)} size="sm" className="hidden sm:inline-flex">
              Start project
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              data-cursor="action"
              className="relative z-[110] flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-bone transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-px w-full bg-bone transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* The lamp is a sibling of the header, not a child: the header takes a
          backdrop-filter when condensed, which would trap the cord in its
          stacking context and bury it under the reality shift it causes.
          It stays visually bolted to the header's bottom edge either way. */}
      <LampThemeToggle condensed={condensed} hidden={open} />

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
