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

export const footerColumns = [
  {
    title: "Engineering",
    links: [
      { label: "Custom Web Development", href: "#capabilities" },
      { label: "Front-End Development", href: "#capabilities" },
      { label: "Back-End Development", href: "#capabilities" },
      { label: "Open Source Development", href: "#capabilities" },
      { label: "PHP Development", href: "#capabilities" },
      { label: "Laravel Development", href: "#capabilities" },
      { label: "Node.js Development", href: "#capabilities" },
      { label: "Drupal Development", href: "#capabilities" },
      { label: "CMS Development", href: "#capabilities" },
    ],
  },
  {
    title: "Commerce & Product",
    links: [
      { label: "E-commerce Solutions", href: "#capabilities" },
      { label: "Shopify", href: "#capabilities" },
      { label: "Magento", href: "#capabilities" },
      { label: "OpenCart", href: "#capabilities" },
      { label: "WooCommerce", href: "#capabilities" },
      { label: "Web App Development", href: "#capabilities" },
      { label: "Minimum Viable Products", href: "#capabilities" },
      { label: "Custom Software Development", href: "#capabilities" },
      { label: "Interactive Prototypes", href: "#capabilities" },
    ],
  },
  {
    title: "Design & Growth",
    links: [
      { label: "Website Design", href: "#capabilities" },
      { label: "UX & UI Design", href: "#capabilities" },
      { label: "Brand Identity", href: "#capabilities" },
      { label: "Mobile App Design", href: "#capabilities" },
      { label: "SEO Marketing", href: "#capabilities" },
      { label: "PPC Marketing", href: "#capabilities" },
      { label: "SMM Marketing", href: "#capabilities" },
      { label: "Content Writing", href: "#capabilities" },
      { label: "Digital Marketing", href: "#capabilities" },
    ],
  },
  {
    title: "Apps & AI",
    links: [
      { label: "iOS Development", href: "#capabilities" },
      { label: "Android Development", href: "#capabilities" },
      { label: "Game Development", href: "#capabilities" },
      { label: "AR/VR App Development", href: "#capabilities" },
      { label: "AI Product Integration", href: "#capabilities" },
      { label: "AI Agents & Automation", href: "#capabilities" },
      { label: "Intelligent Workflows", href: "#capabilities" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
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
