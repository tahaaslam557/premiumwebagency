"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "line";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-3 rounded-full font-medium tracking-[-0.01em] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary: "bg-bone text-void hover:bg-signal-bright",
  ghost: "bg-tint/[0.04] text-bone hover:bg-tint/[0.09] border border-line",
  line: "border border-bone/25 text-bone hover:border-signal-bright hover:text-signal-bright",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[0.9375rem]",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  magnetic?: boolean;
  trailing?: ReactNode;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  magnetic = true,
  trailing,
  ...props
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  const content = (
    <button
      data-cursor="action"
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <span>{children}</span>
      {trailing}
    </button>
  );
  return magnetic ? <Magnetic>{content}</Magnetic> : content;
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  magnetic = true,
  trailing,
  ...props
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");

  const inner = (
    <>
      <span>{children}</span>
      {trailing ?? <Arrow />}
    </>
  );

  const classes = cn(base, variants[variant], sizes[size], className);

  const content = external ? (
    <a
      href={href}
      data-cursor="action"
      className={classes}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...props}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} data-cursor="action" className={classes} {...props}>
      {inner}
    </Link>
  );

  return magnetic ? <Magnetic>{content}</Magnetic> : content;
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
    >
      <path
        d="M1 7h11M7.5 2.5 12 7l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
