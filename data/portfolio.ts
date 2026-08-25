export type WorkImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type WorkSector = {
  index: string;
  key: string;
  code: string;
  title: string;
  statement: string;
  disciplines: string[];
  services: string[];
  images: WorkImage[];
};

/**
 * Sector galleries carried over from the Premium Web Agency portfolio.
 * The source publishes work by industry rather than by named client, and no
 * client names, dates or performance results are published with them — so none
 * are stated here. Every image is a real screen from the source portfolio.
 */
export const work: WorkSector[] = [
  {
    index: "01",
    key: "ecommerce",
    code: "CMX",
    title: "E-Commerce",
    statement: "Storefronts engineered to be finished, not browsed.",
    disciplines: ["Design", "Engineering", "Commerce"],
    services: ["E-commerce Solutions", "Shopify", "WooCommerce", "Payment Integration"],
    images: [
      { src: "/portfolio/e-commerce-new1.webp", width: 1600, height: 3955, alt: "E-Commerce website design by Premium Web Agency — full page screen 1" },
      { src: "/portfolio/e-commerce-new2.webp", width: 1600, height: 4144, alt: "E-Commerce website design by Premium Web Agency — full page screen 2" },
      { src: "/portfolio/e-commerce-new3.webp", width: 1600, height: 4339, alt: "E-Commerce website design by Premium Web Agency — full page screen 3" },
      { src: "/portfolio/e-commerce-new4.webp", width: 1600, height: 4301, alt: "E-Commerce website design by Premium Web Agency — full page screen 4" },
      { src: "/portfolio/e-commerce-new5.webp", width: 1600, height: 6515, alt: "E-Commerce website design by Premium Web Agency — full page screen 5" },
      { src: "/portfolio/e-commerce-new6.webp", width: 1600, height: 6026, alt: "E-Commerce website design by Premium Web Agency — full page screen 6" },
      { src: "/portfolio/e-commerce-new7.webp", width: 1600, height: 6935, alt: "E-Commerce website design by Premium Web Agency — full page screen 7" },
      { src: "/portfolio/e-commerce-new8.webp", width: 1600, height: 8084, alt: "E-Commerce website design by Premium Web Agency — full page screen 8" },
      { src: "/portfolio/e-commerce-new9.webp", width: 1452, height: 5673, alt: "E-Commerce website design by Premium Web Agency — full page screen 9" },
      { src: "/portfolio/e-commerce-new10.webp", width: 1600, height: 5797, alt: "E-Commerce website design by Premium Web Agency — full page screen 10" },
      { src: "/portfolio/e-commerce-new11.webp", width: 1600, height: 5190, alt: "E-Commerce website design by Premium Web Agency — full page screen 11" },
      { src: "/portfolio/e-commerce-new12.webp", width: 1600, height: 4360, alt: "E-Commerce website design by Premium Web Agency — full page screen 12" },
      { src: "/portfolio/e-commerce-new13.webp", width: 960, height: 3529, alt: "E-Commerce website design by Premium Web Agency — full page screen 13" },
      { src: "/portfolio/e-commerce-new14.webp", width: 960, height: 3987, alt: "E-Commerce website design by Premium Web Agency — full page screen 14" },
      { src: "/portfolio/e-commerce-new15.webp", width: 960, height: 3288, alt: "E-Commerce website design by Premium Web Agency — full page screen 15" },
      { src: "/portfolio/e-commerce-new16.webp", width: 960, height: 4495, alt: "E-Commerce website design by Premium Web Agency — full page screen 16" },
    ],
  },
  {
    index: "02",
    key: "technology",
    code: "TEC",
    title: "Technology",
    statement: "Product surfaces for companies that ship software.",
    disciplines: ["Strategy", "Design", "Engineering"],
    services: ["Web App Development", "UX & UI Design", "MVP Development"],
    images: [
      { src: "/portfolio/technology-1.webp", width: 1440, height: 5830, alt: "Technology website design by Premium Web Agency — full page screen 1" },
      { src: "/portfolio/technology-2.webp", width: 960, height: 3256, alt: "Technology website design by Premium Web Agency — full page screen 2" },
      { src: "/portfolio/technology-3.webp", width: 961, height: 3741, alt: "Technology website design by Premium Web Agency — full page screen 3" },
      { src: "/portfolio/technology-4.webp", width: 961, height: 4850, alt: "Technology website design by Premium Web Agency — full page screen 4" },
      { src: "/portfolio/technology-5.webp", width: 960, height: 2674, alt: "Technology website design by Premium Web Agency — full page screen 5" },
      { src: "/portfolio/technology-6.webp", width: 759, height: 2560, alt: "Technology website design by Premium Web Agency — full page screen 6" },
      { src: "/portfolio/technology-t-7.webp", width: 801, height: 5926, alt: "Technology website design by Premium Web Agency — full page screen 7" },
      { src: "/portfolio/technology-t-8.webp", width: 801, height: 2888, alt: "Technology website design by Premium Web Agency — full page screen 8" },
    ],
  },
  {
    index: "03",
    key: "fintech",
    code: "FIN",
    title: "Fintech",
    statement: "Trust, clarity and compliance carried by the interface.",
    disciplines: ["Strategy", "Design", "Engineering"],
    services: ["Custom Web Development", "Brand Identity", "UX & UI Design"],
    images: [
      { src: "/portfolio/finance-Finance-portfolio-1.webp", width: 960, height: 3256, alt: "Fintech website design by Premium Web Agency — full page screen 1" },
      { src: "/portfolio/finance-Finance-portfolio-2.webp", width: 961, height: 5048, alt: "Fintech website design by Premium Web Agency — full page screen 2" },
      { src: "/portfolio/finance-Finance-portfolio-3.webp", width: 960, height: 3578, alt: "Fintech website design by Premium Web Agency — full page screen 3" },
      { src: "/portfolio/finance-Finance-portfolio-4.webp", width: 1440, height: 3239, alt: "Fintech website design by Premium Web Agency — full page screen 4" },
      { src: "/portfolio/finance-Finance-portfolio-5.webp", width: 1247, height: 5693, alt: "Fintech website design by Premium Web Agency — full page screen 5" },
      { src: "/portfolio/finance-Finance-portfolio-6.webp", width: 1247, height: 7110, alt: "Fintech website design by Premium Web Agency — full page screen 6" },
      { src: "/portfolio/finance-t-7.webp", width: 801, height: 2786, alt: "Fintech website design by Premium Web Agency — full page screen 7" },
      { src: "/portfolio/finance-t-8.webp", width: 801, height: 2926, alt: "Fintech website design by Premium Web Agency — full page screen 8" },
    ],
  },
  {
    index: "04",
    key: "transport",
    code: "TRN",
    title: "Transport & Logistics",
    statement: "Fleet, freight and tracking rendered legible.",
    disciplines: ["Strategy", "Engineering", "Automation"],
    services: ["Custom Software Development", "Web App Development", "Process Automation"],
    images: [
      { src: "/portfolio/transport-t-1.webp", width: 960, height: 4988, alt: "Transport & Logistics website design by Premium Web Agency — full page screen 1" },
      { src: "/portfolio/transport-t-2.webp", width: 960, height: 2505, alt: "Transport & Logistics website design by Premium Web Agency — full page screen 2" },
      { src: "/portfolio/transport-t-3.webp", width: 960, height: 4898, alt: "Transport & Logistics website design by Premium Web Agency — full page screen 3" },
      { src: "/portfolio/transport-t-4.webp", width: 960, height: 3559, alt: "Transport & Logistics website design by Premium Web Agency — full page screen 4" },
      { src: "/portfolio/transport-t-5.webp", width: 960, height: 3978, alt: "Transport & Logistics website design by Premium Web Agency — full page screen 5" },
      { src: "/portfolio/transport-t-6.webp", width: 960, height: 4851, alt: "Transport & Logistics website design by Premium Web Agency — full page screen 6" },
      { src: "/portfolio/transport-t-7.webp", width: 801, height: 4006, alt: "Transport & Logistics website design by Premium Web Agency — full page screen 7" },
      { src: "/portfolio/transport-t-8.webp", width: 801, height: 2909, alt: "Transport & Logistics website design by Premium Web Agency — full page screen 8" },
    ],
  },
  {
    index: "05",
    key: "real-estate",
    code: "RES",
    title: "Real Estate",
    statement: "Listings, search and enquiry as a single funnel.",
    disciplines: ["Design", "Engineering", "Growth"],
    services: ["CMS Development", "Website Design", "SEO Marketing"],
    images: [
      { src: "/portfolio/real-state-Real_estate-portfolio-1.webp", width: 960, height: 4406, alt: "Real Estate website design by Premium Web Agency — full page screen 1" },
      { src: "/portfolio/real-state-Real_estate-portfolio-2.webp", width: 960, height: 3148, alt: "Real Estate website design by Premium Web Agency — full page screen 2" },
      { src: "/portfolio/real-state-Real_estate-portfolio-3.webp", width: 960, height: 2960, alt: "Real Estate website design by Premium Web Agency — full page screen 3" },
      { src: "/portfolio/real-state-Real_estate-portfolio-4.webp", width: 960, height: 2196, alt: "Real Estate website design by Premium Web Agency — full page screen 4" },
      { src: "/portfolio/real-state-Real_estate-portfolio-5.webp", width: 960, height: 2924, alt: "Real Estate website design by Premium Web Agency — full page screen 5" },
      { src: "/portfolio/real-state-Real_estate-portfolio-6.webp", width: 640, height: 2560, alt: "Real Estate website design by Premium Web Agency — full page screen 6" },
      { src: "/portfolio/real-state-t-7.webp", width: 960, height: 8346, alt: "Real Estate website design by Premium Web Agency — full page screen 7" },
      { src: "/portfolio/real-state-t-8.webp", width: 801, height: 1972, alt: "Real Estate website design by Premium Web Agency — full page screen 8" },
    ],
  },
  {
    index: "06",
    key: "fitness",
    code: "FIT",
    title: "Fitness",
    statement: "Membership, scheduling and coaching as one interface.",
    disciplines: ["Design", "Engineering", "Automation"],
    services: ["Custom Web Development", "UX & UI Design", "Booking Systems"],
    images: [
      { src: "/portfolio/fitness-t-1.webp", width: 960, height: 3578, alt: "Fitness website design by Premium Web Agency — full page screen 1" },
      { src: "/portfolio/fitness-t-2.webp", width: 960, height: 3578, alt: "Fitness website design by Premium Web Agency — full page screen 2" },
      { src: "/portfolio/fitness-t-3.webp", width: 960, height: 8291, alt: "Fitness website design by Premium Web Agency — full page screen 3" },
      { src: "/portfolio/fitness-t-4.webp", width: 960, height: 8291, alt: "Fitness website design by Premium Web Agency — full page screen 4" },
      { src: "/portfolio/fitness-t-5.webp", width: 960, height: 7119, alt: "Fitness website design by Premium Web Agency — full page screen 5" },
      { src: "/portfolio/fitness-t-6.webp", width: 960, height: 4575, alt: "Fitness website design by Premium Web Agency — full page screen 6" },
      { src: "/portfolio/fitness-t-7.webp", width: 801, height: 3274, alt: "Fitness website design by Premium Web Agency — full page screen 7" },
      { src: "/portfolio/fitness-t-8.webp", width: 801, height: 2773, alt: "Fitness website design by Premium Web Agency — full page screen 8" },
      { src: "/portfolio/fitness-t-9.webp", width: 580, height: 2637, alt: "Fitness website design by Premium Web Agency — full page screen 9" },
    ],
  },
  {
    index: "07",
    key: "food",
    code: "FDS",
    title: "Food",
    statement: "Menus, ordering and delivery built for the rush.",
    disciplines: ["Design", "Commerce", "Growth"],
    services: ["Website Design", "Online Ordering Integration", "Digital Marketing"],
    images: [
      { src: "/portfolio/food-t-1.webp", width: 960, height: 5468, alt: "Food website design by Premium Web Agency — full page screen 1" },
      { src: "/portfolio/food-t-2.webp", width: 960, height: 3706, alt: "Food website design by Premium Web Agency — full page screen 2" },
      { src: "/portfolio/food-t-3.webp", width: 960, height: 3578, alt: "Food website design by Premium Web Agency — full page screen 3" },
      { src: "/portfolio/food-t-4.webp", width: 960, height: 3412, alt: "Food website design by Premium Web Agency — full page screen 4" },
      { src: "/portfolio/food-t-5.webp", width: 960, height: 3373, alt: "Food website design by Premium Web Agency — full page screen 5" },
      { src: "/portfolio/food-t-6.webp", width: 960, height: 3103, alt: "Food website design by Premium Web Agency — full page screen 6" },
      { src: "/portfolio/food-t-7.webp", width: 801, height: 2577, alt: "Food website design by Premium Web Agency — full page screen 7" },
      { src: "/portfolio/food-t-8.webp", width: 801, height: 2902, alt: "Food website design by Premium Web Agency — full page screen 8" },
    ],
  },
  {
    index: "08",
    key: "construction",
    code: "CST",
    title: "Construction",
    statement: "Heavy industry, presented with weight and precision.",
    disciplines: ["Design", "Engineering", "Growth"],
    services: ["Website Design", "WordPress Development", "SEO Marketing"],
    images: [
      { src: "/portfolio/construction-1.webp", width: 960, height: 9084, alt: "Construction website design by Premium Web Agency — full page screen 1" },
      { src: "/portfolio/construction-2.webp", width: 960, height: 1894, alt: "Construction website design by Premium Web Agency — full page screen 2" },
      { src: "/portfolio/construction-3.webp", width: 960, height: 2412, alt: "Construction website design by Premium Web Agency — full page screen 3" },
      { src: "/portfolio/construction-5.webp", width: 1247, height: 5693, alt: "Construction website design by Premium Web Agency — full page screen 4" },
      { src: "/portfolio/construction-6.webp", width: 1247, height: 7110, alt: "Construction website design by Premium Web Agency — full page screen 5" },
      { src: "/portfolio/construction-sc6.webp", width: 1366, height: 4922, alt: "Construction website design by Premium Web Agency — full page screen 6" },
      { src: "/portfolio/construction-t-7.webp", width: 801, height: 2818, alt: "Construction website design by Premium Web Agency — full page screen 7" },
      { src: "/portfolio/construction-t-8.webp", width: 801, height: 3228, alt: "Construction website design by Premium Web Agency — full page screen 8" },
    ],
  },
];

export const workSummary = {
  sectors: work.length,
  screens: work.reduce((total, sector) => total + sector.images.length, 0),
};
