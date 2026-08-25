export type Stage = {
  index: string;
  title: string;
  signal: string;
  body: string;
  outputs: string[];
};

export const methodology: Stage[] = [
  {
    index: "01",
    title: "Discover",
    signal: "INPUT",
    body: "We map the business, the audience and the opportunity before a single pixel moves. Constraints get written down; assumptions get tested.",
    outputs: ["Business & market audit", "Audience mapping", "Opportunity brief", "Success metrics"],
  },
  {
    index: "02",
    title: "Think",
    signal: "PROCESSING",
    body: "Research, strategy and intelligence define the system. We decide what the product is before we decide what it looks like.",
    outputs: ["Product strategy", "Information architecture", "Content model", "Technical direction"],
  },
  {
    index: "03",
    title: "Design",
    signal: "SIGNAL",
    body: "The visual and interaction language is built as a system, not a set of screens — tokens, type scale, motion rules, component logic.",
    outputs: ["Design system", "UI & UX design", "Interaction & motion spec", "Brand assets"],
  },
  {
    index: "04",
    title: "Build",
    signal: "OUTPUT",
    body: "Engineering with modern stacks: custom development, CMS, commerce, integrations, and the infrastructure to run them.",
    outputs: ["Front-end & back-end build", "CMS / admin panel", "Payments & integrations", "Deployment"],
  },
  {
    index: "05",
    title: "Intelligently Scale",
    signal: "OPTIMIZE",
    body: "Automation, analytics, SEO and AI-assisted operations keep the system improving after launch instead of decaying.",
    outputs: ["Analytics & reporting", "SEO & performance", "Automation & AI workflows", "Maintenance & support"],
  },
];
