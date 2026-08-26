export type NavItem = {
  label: string;
  href: string;
  index: string;
};

export const navigation: NavItem[] = [
  { label: "Intelligence", href: "#intelligence", index: "01" },
  { label: "Capabilities", href: "#capabilities", index: "02" },
  { label: "Work", href: "#work", index: "03" },
  { label: "Method", href: "#method", index: "04" },
  { label: "Pricing", href: "#pricing", index: "05" },
  { label: "Contact", href: "#contact", index: "06" },
];

/**
 * Every service link here resolves to a real route under /services.
 * The label is the join key with `data/service-pages.ts` — a label with no
 * matching page is a build-time failure there, not a silent 404 here.
 *
 * The last three in "Apps & AI" are the top-level routes rather than services.
 * Pricing and Contact used to be `#pricing` and `#contact`, which only worked
 * from the homepage and dumped you at the top of it from anywhere else; they
 * are real pages now. The homepage's own section nav still uses the anchors.
 */
export const footerColumns = [
  {
    title: "Engineering",
    links: [
      { label: "Custom Web Development", href: "/services/custom-web-development" },
      { label: "Front-End Development", href: "/services/front-end-development" },
      { label: "Back-End Development", href: "/services/back-end-development" },
      { label: "Open Source Development", href: "/services/open-source-development" },
      { label: "PHP Development", href: "/services/php-development" },
      { label: "Laravel Development", href: "/services/laravel-development" },
      { label: "Node.js Development", href: "/services/nodejs-development" },
      { label: "Drupal Development", href: "/services/drupal-development" },
      { label: "CMS Development", href: "/services/cms-development" },
    ],
  },
  {
    title: "Commerce & Product",
    links: [
      { label: "E-commerce Solutions", href: "/services/ecommerce-solutions" },
      { label: "Shopify", href: "/services/shopify" },
      { label: "Magento", href: "/services/magento" },
      { label: "OpenCart", href: "/services/opencart" },
      { label: "WooCommerce", href: "/services/woocommerce" },
      { label: "Web App Development", href: "/services/web-app-development" },
      { label: "Minimum Viable Products", href: "/services/minimum-viable-products" },
      { label: "Custom Software Development", href: "/services/custom-software-development" },
      { label: "Interactive Prototypes", href: "/services/interactive-prototypes" },
    ],
  },
  {
    title: "Design & Growth",
    links: [
      { label: "Website Design", href: "/services/website-design" },
      { label: "UX & UI Design", href: "/services/ux-ui-design" },
      { label: "Brand Identity", href: "/services/brand-identity" },
      { label: "Mobile App Design", href: "/services/mobile-app-design" },
      { label: "SEO Marketing", href: "/services/seo-marketing" },
      { label: "PPC Marketing", href: "/services/ppc-marketing" },
      { label: "SMM Marketing", href: "/services/smm-marketing" },
      { label: "Content Writing", href: "/services/content-writing" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
    ],
  },
  {
    title: "Apps & AI",
    links: [
      { label: "iOS Development", href: "/services/ios-development" },
      { label: "Android Development", href: "/services/android-development" },
      { label: "Game Development", href: "/services/game-development" },
      { label: "AR/VR App Development", href: "/services/ar-vr-app-development" },
      { label: "AI Product Integration", href: "/services/ai-product-integration" },
      { label: "AI Agents & Automation", href: "/services/ai-agents-automation" },
      { label: "Intelligent Workflows", href: "/services/intelligent-workflows" },
      { label: "All Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/**
 * These four used to point out at the old PHP site. They are native routes
 * now — `app/terms-and-conditions`, `app/sms-terms-and-conditions`,
 * `app/privacy-policy`, `app/faqs` — and nothing here should ever go back to
 * an absolute URL on premiumwebagency.com.
 */
export const legalLinks = [
  { label: "Terms of Use", href: "/terms-and-conditions" },
  { label: "SMS Terms & Conditions", href: "/sms-terms-and-conditions" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "FAQs", href: "/faqs" },
];
