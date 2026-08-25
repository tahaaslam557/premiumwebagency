export type Capability = {
  index: string;
  key: string;
  title: string;
  statement: string;
  body: string;
  services: string[];
};

/**
 * The eight-layer intelligence stack. Every service listed under a layer is a
 * real service offered by Premium Web Agency — the layers are the organising
 * structure, not new claims.
 */
export const capabilities: Capability[] = [
  {
    index: "01",
    key: "strategy",
    title: "Strategy",
    statement: "Strategy becomes intelligence.",
    body: "Before design or code, we define the system: what the business needs, what the audience responds to, and what the product must do to matter.",
    services: [
      "Product & digital strategy",
      "Business analysis",
      "Consumer analysis",
      "Competitor analysis",
      "Information architecture",
      "Minimum Viable Products",
    ],
  },
  {
    index: "02",
    key: "design",
    title: "Design",
    statement: "Design becomes systems.",
    body: "Interfaces built as design systems — typography, colour, motion and component logic that stay coherent as the product grows.",
    services: [
      "Website Design",
      "UX & UI Design",
      "Mobile App Design",
      "Logo Design",
      "Brand Identity",
      "Interactive Prototypes",
      "Banner & brand assets",
    ],
  },
  {
    index: "03",
    key: "engineering",
    title: "Engineering",
    statement: "Code becomes leverage.",
    body: "Custom builds and open-source stacks, engineered for maintainability rather than for a demo.",
    services: [
      "Custom Web Development",
      "Front-End Development",
      "Back-End Development",
      "Web App Development",
      "Open Source Development",
      "PHP Development",
      "Laravel Development",
      "Node.js Development",
      "Drupal Development",
      "CMS Development",
      "WordPress Development",
      "Custom Software Development",
    ],
  },
  {
    index: "04",
    key: "commerce",
    title: "Commerce",
    statement: "Catalogues become experiences.",
    body: "Storefronts with real operational depth: inventory, payments, fulfilment and a product experience customers finish.",
    services: [
      "E-commerce Solutions",
      "Shopify",
      "Magento",
      "OpenCart",
      "WooCommerce",
      "Payment gateway integration",
      "Inventory & order management",
      "Product experience design",
    ],
  },
  {
    index: "05",
    key: "growth",
    title: "Growth",
    statement: "Data becomes decisions.",
    body: "Acquisition and retention treated as an engineering problem — measured, iterated, reported.",
    services: [
      "SEO Marketing",
      "PPC Marketing",
      "SMM Marketing",
      "Digital Marketing",
      "Content Writing",
      "Web Content",
      "Article Writing",
      "Blog Writing",
      "Analytics & reporting",
    ],
  },
  {
    index: "06",
    key: "apps",
    title: "Applications",
    statement: "Products become platforms.",
    body: "Native and cross-platform applications, from first prototype through store release and beyond.",
    services: [
      "Mobile App Development",
      "iOS Development",
      "Android Development",
      "Game Development",
      "AR/VR App Development",
      "Web portals & dashboards",
      "Conferencing & LMS portals",
    ],
  },
  {
    index: "07",
    key: "automation",
    title: "Automation",
    statement: "Operations become invisible.",
    body: "Process automation across inventory, invoicing, scheduling and supplier workflows — the unglamorous work that compounds.",
    services: [
      "Process automation tools",
      "Automated invoicing & estimates",
      "Inventory & warehouse automation",
      "Booking & scheduling systems",
      "CRM & sales automation",
      "Marketing automation",
    ],
  },
  {
    index: "08",
    key: "ai",
    title: "AI Systems",
    statement: "Intelligence becomes the operating system.",
    body: "The layer the rest of the stack now runs on: AI woven into the product, the workflow and the operations behind both.",
    services: [
      "AI product integration",
      "AI agents",
      "Intelligent workflows",
      "AI-powered customer experiences",
      "AI-assisted operations",
      "Custom AI interfaces",
      "Machine learning for supply chain & warehousing",
      "Natural language processing for data quality",
    ],
  },
];

/** Short statements used by the AI identity section. */
export const manifesto = [
  "Strategy becomes intelligence.",
  "Design becomes systems.",
  "Code becomes leverage.",
  "Data becomes decisions.",
  "Brands become experiences.",
];
