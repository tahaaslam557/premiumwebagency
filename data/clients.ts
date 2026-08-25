export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/** Verbatim client feedback published on premiumwebagency.com. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "The Premium Web Agency web service has greatly met our needs. They were spot on. As a new business, we needed something dependable, reasonably priced, and customized, and Premium Web Agency answered all of our needs.",
    author: "Amber Alvarez",
    role: "Project Owner, Cuts Clothing",
  },
  {
    quote:
      "Working with Justin and Steve Smith was truly amazing. Their dedicated approach and expertise completely transformed our ineffective website. Now it's a traffic powerhouse and looks incredible. I highly recommend Justin and Steve Smith for any web project.",
    author: "Nathan Walker",
    role: "Senior Software Engineer",
  },
  {
    quote:
      "Working with Premium Web Agency has been an exceptional experience. Specifically, Sean and Sam's dedication to understanding our unique needs was truly impressive. They crafted a powerful SEO strategy that not only expanded our visibility but delivered incredible results. We're now consistently among the top results on google search. Their expertise is unmatched!",
    author: "John Lecatelli",
    role: "Co-founder, Loctea",
  },
  {
    quote:
      "Stuffs are very nice and knowledgeable of website development. While customizing the website to suit my specific requirements, it is important to be mindful of potential costs, as they can accumulate quickly if not managed carefully.",
    author: "Ellen",
    role: "United States",
  },
];

/** Industries the published portfolio covers. Doubles as the client-network map. */
export const sectors = [
  { code: "CMX", label: "Ecommerce", weight: 24 },
  { code: "FIT", label: "Fitness", weight: 9 },
  { code: "FDS", label: "Food", weight: 8 },
  { code: "TRN", label: "Transport", weight: 8 },
  { code: "TEC", label: "Technology", weight: 8 },
  { code: "RES", label: "Real Estate", weight: 8 },
  { code: "FIN", label: "Fintech", weight: 8 },
  { code: "CST", label: "Construction", weight: 8 },
];

/** Recognition as listed by the source site. */
export const recognition = [
  { label: "Fast Company", note: "First recognition" },
  { label: "Fortune 100", note: "Enterprise engagement" },
  { label: "The Software Report", note: "Industry listing" },
];

/**
 * Platform logo strip carried over from the source site. The `-dark` files are
 * recoloured variants of the same marks — the originals are drawn in near-black
 * ink for light backgrounds and vanish on this one.
 */
export const stack = [
  "Amazon",
  "GoDaddy",
  "Shopify",
  "Squarespace",
  "Weebly",
  "Wix",
  "WordPress",
].map((name, index) => ({
  /** Recoloured for dark grounds. */
  src: `/clients/stack-${index + 1}-dark.webp`,
  /** The original near-black ink, which is what paper wants. */
  lightSrc: `/clients/stack-${index + 1}.webp`,
  alt: name,
  name,
}));
