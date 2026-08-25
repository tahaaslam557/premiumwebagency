/**
 * Single source of truth for factual company information.
 * Every value here is taken from premiumwebagency.com — edit here, never inline.
 */

export const site = {
  name: "Premium Web Agency",
  shortName: "PWA",
  legalName: "Premium Web Agency",
  url: "https://premiumwebagency.com",
  positioning: "AI-Native Digital Products, Design & Growth",
  description:
    "Premium Web Agency designs, builds and scales digital systems where intelligence is the operating system — web platforms, commerce, apps and AI-driven growth.",
  founded: 2025,
} as const;

export const contact = {
  phone: "+1 (833) 945-5567",
  phoneHref: "tel:+18339455567",
  altPhone: "+1 (832) 501-0078",
  altPhoneHref: "tel:+18325010078",
  email: "support@premiumwebagency.com",
  emailHref: "mailto:support@premiumwebagency.com",
  offices: [
    {
      region: "United States",
      city: "Santa Clara",
      address: "2445 Augustine Dr, Santa Clara, CA 95054",
      coords: "37.3789° N / 121.9700° W",
    },
    {
      region: "United States",
      city: "Dallas",
      address: "539 W Commerce St #5348, Dallas, TX 75208",
      coords: "32.7767° N / 96.7970° W",
    },
  ],
} as const;

export const reputation = {
  rating: 4.7,
  ratingScale: 5,
  customersServed: 1200,
  customersLabel: "1200+ happy customers",
} as const;

/**
 * Promotional offer carried over from the source site.
 * Set `active: false` to remove every offer surface across the site at once.
 */
export const offer = {
  active: true,
  headline: "Up to 70% off",
  detail: "Current promotional pricing is reflected in every package below.",
  comboHeadline: "50% off combo packages",
  inclusions: [
    "Free logo & business card design",
    "Custom designer concept delivered in 24 hours",
    "Full copyright ownership and production-ready files",
    "100% satisfaction guarantee",
  ],
} as const;

export const guarantees = [
  "100% Satisfaction Guarantee",
  "100% Unique Design Guarantee",
  "100% Money Back Guarantee",
  "100% Ownership Rights",
] as const;

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/", handle: "FB" },
  { label: "Instagram", href: "https://www.instagram.com/", handle: "IG" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", handle: "IN" },
  { label: "X", href: "https://x.com/", handle: "X" },
] as const;
