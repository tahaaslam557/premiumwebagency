import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Grain } from "@/components/ui/Grain";
import { Preloader } from "@/components/hero/Preloader";
import { NO_FLASH_SCRIPT, THEME_COLOR } from "@/lib/theme";
import { contact, reputation, site } from "@/data/site";

const display = Geist({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.positioning}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "AI web agency",
    "custom web development",
    "ecommerce development",
    "web app development",
    "mobile app design",
    "AI automation agency",
    "UX UI design",
    "SEO",
    "Shopify",
    "WooCommerce",
  ],
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.positioning}`,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.positioning}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
};

export const viewport: Viewport = {
  // Dark is the served default; the boot script rewrites the meta tag to the
  // resolved theme before paint, and the provider keeps it in step after.
  themeColor: THEME_COLOR.dark,
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  description: site.description,
  telephone: contact.phone,
  email: contact.email,
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: reputation.rating,
    bestRating: reputation.ratingScale,
    ratingCount: reputation.customersServed,
  },
  address: contact.offices.map((office) => ({
    "@type": "PostalAddress",
    streetAddress: office.address,
    addressLocality: office.city,
    addressCountry: "US",
  })),
  areaServed: "Worldwide",
  serviceType: [
    "Custom Web Development",
    "E-commerce Solutions",
    "Web App Development",
    "Mobile App Development",
    "UX & UI Design",
    "Brand Identity",
    "SEO Marketing",
    "AI Systems & Automation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `data-theme` is served as dark and corrected in <head> before first
    // paint, so React must be told not to police this one attribute.
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${mono.variable}`}
    >
      <head>
        {/* Runs before anything paints: reads the stored choice, falls back to
            the system preference, then to dark. Without it the page would
            flash the wrong environment on every load. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>
        {/* Without scripting, Motion never runs and its SSR-inlined
            `opacity: 0` would strand the content. A stylesheet !important
            beats an inline style that is not itself !important. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a
          href="#main"
          className="skip-link rounded-full bg-signal px-5 py-3 text-sm font-medium text-white"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Parked off-screen with a transform rather than `sr-only` +
            `focus:not-sr-only`: those two utilities have equal specificity, so
            which one wins comes down to stylesheet order — and the link stayed
            invisible on focus. A transform has nothing to tie with.
            Plain `:focus`, not `:focus-visible` — a skip link should appear for
            any focus, including one moved programmatically. */}
        <a
          href="#main"
          className="fixed left-6 top-6 z-[200] -translate-y-24 rounded-full bg-signal px-5 py-3 text-sm font-medium text-white transition-transform duration-300 focus:translate-y-0"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <Preloader />
          <SmoothScroll />
          <Cursor />
          <Grain />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
