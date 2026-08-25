export type Metric = {
  index: string;
  value: number;
  suffix: string;
  label: string;
  caption: string;
};

/**
 * Figures published on premiumwebagency.com. Do not invent or inflate these.
 */
export const metrics: Metric[] = [
  {
    index: "01",
    value: 987,
    suffix: "+",
    label: "Websites Created",
    caption: "Informative, dynamic and custom-built platforms shipped to production.",
  },
  {
    index: "02",
    value: 3487,
    suffix: "+",
    label: "Logo Designs",
    caption: "Identity systems drawn, refined and delivered in full file formats.",
  },
  {
    index: "03",
    value: 878,
    suffix: "+",
    label: "Ecommerce Websites Created",
    caption: "Storefronts with cart, payment and inventory integration.",
  },
  {
    index: "04",
    value: 74,
    suffix: "+",
    label: "Mobile Applications Created",
    caption: "iOS and Android products taken from concept to store release.",
  },
];
