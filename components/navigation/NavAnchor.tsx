"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

import { sectionHref } from "@/lib/utils";

type NavAnchorProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string };

/**
 * One entry from `navigation`, rendered as whichever kind of link it is.
 *
 * That list mixes two things now: homepage anchors (`#work`) and real routes
 * (`/pricing`). They cannot be rendered the same way. An anchor has to stay a
 * plain <a> — and be rewritten to `/#work` when it is read from anywhere but
 * the homepage, which is what `sectionHref` does. A route wants <Link>, so it
 * prefetches and navigates client-side instead of reloading the document and
 * throwing away the scroll position, the theme transition and the rest.
 *
 * Putting the choice here means the three places that render the nav — header,
 * mobile menu, footer index — cannot each get it slightly differently wrong.
 */
export function NavAnchor({ href, children, ...rest }: NavAnchorProps) {
  const pathname = usePathname();

  if (href.startsWith("#")) {
    return (
      <a href={sectionHref(href, pathname)} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
