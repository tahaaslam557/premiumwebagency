/**
 * The thirty-four service routes linked from the footer.
 *
 * Everything a service page needs that is *specific* to that service lives on
 * the entry: the summary, what it delivers, the stack it runs on, the three
 * things a client actually gets out of it.
 *
 * Everything that is genuinely shared is shared, and deliberately so. The
 * process for shipping a Laravel build and a Node build is the same process;
 * writing it out thirty-four times would not make it more true, it would just
 * make thirty-four places to edit when it changes. So process and the standing
 * questions hang off a `track` — how the work actually runs — while anything a
 * page needs to say for itself stays on the service.
 *
 * No invented numbers anywhere in here. The only figures on these pages come
 * from `data/site.ts`, which is sourced from the live company site.
 */

export type Track = "build" | "design" | "growth";

export type ServiceCategoryKey = "engineering" | "commerce" | "studio" | "apps";

export type ProcessStep = { index: string; title: string; body: string };
export type Faq = { question: string; answer: string };
export type Deliverable = { name: string; description: string };
export type Highlight = { title: string; body: string };

export type ServicePage = {
  slug: string;
  /** Verbatim the label the footer uses, so the two can never drift. */
  label: string;
  category: ServiceCategoryKey;
  track: Track;
  eyebrow: string;
  /** Newline-separated; each line is masked and revealed on its own. */
  title: string;
  summary: string;
  highlights: Highlight[];
  deliverables: Deliverable[];
  stack: string[];
  /** Appended to the track's standing questions. */
  faqs?: Faq[];
  related: string[];
  /** Meta description. Written per service — search engines show this. */
  description: string;
};

export const serviceCategories: Record<
  ServiceCategoryKey,
  { label: string; blurb: string }
> = {
  engineering: {
    label: "Engineering",
    blurb: "Custom builds and open-source stacks, engineered to be maintained.",
  },
  commerce: {
    label: "Commerce & Product",
    blurb: "Storefronts and products built to sell, not to demo.",
  },
  studio: {
    label: "Design & Growth",
    blurb: "The system people see, and the work that brings them to it.",
  },
  apps: {
    label: "Apps & AI",
    blurb: "Native surfaces and the intelligence running underneath them.",
  },
};

export const tracks: Record<
  Track,
  { label: string; process: ProcessStep[]; faqs: Faq[] }
> = {
  build: {
    label: "How the build runs",
    process: [
      {
        index: "01",
        title: "Scope",
        body: "We write down what the thing has to do before we write any of it. Constraints, integrations, edge cases and the definition of done — agreed in writing, not assumed.",
      },
      {
        index: "02",
        title: "Architect",
        body: "Data model, service boundaries, hosting and the deployment path get decided up front. Most of what makes a build expensive later is decided here.",
      },
      {
        index: "03",
        title: "Build",
        body: "Shipped in working increments against a staging environment you can open at any point. No reveal at the end — you watch it come together.",
      },
      {
        index: "04",
        title: "Harden",
        body: "Performance, accessibility, error states, SEO fundamentals and cross-browser behaviour. The unglamorous pass that separates a demo from a product.",
      },
      {
        index: "05",
        title: "Ship",
        body: "Deployment, DNS and email cutover, a CMS walkthrough and the handover documents. The site goes live once dues are cleared, per our terms.",
      },
    ],
    faqs: [
      {
        question: "Who owns the code and the designs at the end?",
        answer:
          "You do. On written finalisation the final files and full ownership rights transfer to you. Materials generated during revision cycles on the way to the final product are not included — that is set out in our Terms and Conditions.",
      },
      {
        question: "Can you work with a stack or a codebase we already have?",
        answer:
          "Usually, yes. We will audit what exists before quoting so the estimate reflects the real state of the code rather than a guess at it. If the honest answer is that a rebuild costs less than an adoption, we will say so.",
      },
      {
        question: "What do you need from us to start?",
        answer:
          "A brief with enough in it to design against — goals, audience, any brand or technical constraints, and who signs off. Content and product data usually come from your side unless population is purchased as part of the package.",
      },
    ],
  },
  design: {
    label: "How the design runs",
    process: [
      {
        index: "01",
        title: "Discover",
        body: "The business, the audience and the opportunity get mapped before a single pixel moves. Assumptions get written down so they can be tested rather than inherited.",
      },
      {
        index: "02",
        title: "Define",
        body: "Structure before surface — information architecture, key flows and the hierarchy of what matters on each screen.",
      },
      {
        index: "03",
        title: "Design",
        body: "Concepts in your revision allowance, iterated until they land. Revised work comes back within 48 hours of a request.",
      },
      {
        index: "04",
        title: "Systemise",
        body: "The approved direction becomes tokens, type scale, components and motion rules — so the tenth screen is as considered as the first.",
      },
      {
        index: "05",
        title: "Hand off",
        body: "Source files, exported assets and a system anyone can build from, whether that is us or your own team.",
      },
    ],
    faqs: [
      {
        question: "How many revisions are included?",
        answer:
          "Whatever your selected package states, and we keep revising within it until the work is right. Revised designs come back within 48 hours. Requesting revisions does affect refund eligibility — the specifics are in our Terms and Conditions.",
      },
      {
        question: "Do we get the source files?",
        answer:
          "Yes. On finalisation you receive the final core files and own the finished design outright, to use however you see fit.",
      },
      {
        question: "Can you work from our existing brand guidelines?",
        answer:
          "Yes — send them with the brief and the work is designed inside them. Where a guideline actively fights the medium we will flag it and propose an alternative rather than quietly ignore it.",
      },
    ],
  },
  growth: {
    label: "How the work runs",
    process: [
      {
        index: "01",
        title: "Audit",
        body: "Where you actually stand today — traffic, rankings, spend, creative and the competitive picture. Baselines get recorded so improvement is measurable rather than asserted.",
      },
      {
        index: "02",
        title: "Plan",
        body: "Targets, channels, budget split and the calendar. What we are optimising for is agreed before anything is spent.",
      },
      {
        index: "03",
        title: "Execute",
        body: "Build, publish, launch. Creative and copy produced against the plan and shipped on the schedule agreed.",
      },
      {
        index: "04",
        title: "Measure",
        body: "Reporting against the baseline, not against vanity. What moved, what did not, and what we are changing next cycle.",
      },
      {
        index: "05",
        title: "Compound",
        body: "The work that is proven gets more budget; the work that is not gets cut. Growth comes from repeating that honestly.",
      },
    ],
    faqs: [
      {
        question: "How soon will we see results?",
        answer:
          "It depends entirely on the channel. Paid media produces data within days. Organic search and content compound over months, not weeks — anyone promising otherwise is guessing. We agree on the reporting cadence up front so you can see the trend either way.",
      },
      {
        question: "Are marketing services covered by the money-back guarantee?",
        answer:
          "No. SEO plans, ad campaigns and social media management sit outside the 100% refund policy that covers our design services. That is set out plainly in our Terms and Conditions, including for services bought as part of a bundle.",
      },
      {
        question: "Who owns the accounts and the data?",
        answer:
          "You do. Ad accounts, analytics properties and profiles are set up under your ownership wherever the platform allows it, so nothing is stranded if the engagement ends.",
      },
    ],
  },
};

export const servicePages: ServicePage[] = [
  // ---------------------------------------------------------------- Engineering
  {
    slug: "custom-web-development",
    label: "Custom Web Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "Custom web\ndevelopment.",
    summary:
      "Sites and platforms built for your problem rather than bent out of a template. When the off-the-shelf answer stops fitting — unusual data, real integrations, a workflow nobody else has — custom is what is left, and it should be engineered to be maintained by whoever comes next.",
    description:
      "Custom web development from Premium Web Agency — bespoke sites and platforms engineered around your data, integrations and workflows, built to be maintained.",
    highlights: [
      { title: "Built to your model", body: "The data model follows your business, not a plugin's idea of it." },
      { title: "Yours at the end", body: "Full ownership of the finished build on finalisation." },
      { title: "Made to maintain", body: "Documented, conventional code your next developer can read." },
    ],
    deliverables: [
      { name: "Technical discovery", description: "Requirements, integrations and constraints written down before estimating, so the number means something." },
      { name: "Architecture & data model", description: "Schema, service boundaries, hosting topology and the deployment path, decided up front." },
      { name: "Front-end build", description: "Responsive, accessible interfaces built from components rather than pages." },
      { name: "Back-end & APIs", description: "Application logic, integrations and the endpoints your other systems need." },
      { name: "CMS & admin", description: "An editing surface your team can actually operate, with a written manual." },
      { name: "Launch & handover", description: "Deployment, DNS and email cutover, source files and documentation." },
    ],
    stack: ["TypeScript", "React", "Next.js", "Node.js", "PHP", "Laravel", "PostgreSQL", "MySQL", "Redis", "Docker", "REST", "GraphQL"],
    related: ["front-end-development", "back-end-development", "web-app-development"],
  },
  {
    slug: "front-end-development",
    label: "Front-End Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "Front-end\ndevelopment.",
    summary:
      "The half of the product people actually touch. Interfaces built as component systems — typed, accessible and fast on the hardware your audience really owns, not on the machine it was built on.",
    description:
      "Front-end development from Premium Web Agency — accessible, fast component systems in React, Next.js and TypeScript, built from a design system rather than page by page.",
    highlights: [
      { title: "Components, not pages", body: "A system that stays coherent as the product grows." },
      { title: "Accessible by default", body: "Keyboard paths, focus states and semantics built in, not retrofitted." },
      { title: "Fast on real devices", body: "Budgeted and measured on mid-range hardware." },
    ],
    deliverables: [
      { name: "Design system in code", description: "Tokens, type scale, spacing and components mapped from the design source of truth." },
      { name: "Responsive implementation", description: "Every breakpoint built and checked, not just the two in the mockup." },
      { name: "Accessibility pass", description: "Semantics, keyboard navigation, focus management and contrast checked against WCAG." },
      { name: "Performance budget", description: "Core Web Vitals measured and held, with images, fonts and scripts paid for deliberately." },
      { name: "Motion & interaction", description: "Transitions that carry meaning, and that stand down under reduced-motion." },
      { name: "API integration", description: "Typed data layer wired to your endpoints, with real loading and error states." },
    ],
    stack: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Motion", "GSAP", "Three.js", "Vite", "Storybook", "Playwright", "Vitest"],
    related: ["ux-ui-design", "custom-web-development", "web-app-development"],
  },
  {
    slug: "back-end-development",
    label: "Back-End Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "Back-end\ndevelopment.",
    summary:
      "The part nobody sees until it fails. Data models, APIs, jobs and integrations built to hold up under real load, with the boring things — migrations, logging, backups, error paths — treated as part of the job rather than as an afterthought.",
    description:
      "Back-end development from Premium Web Agency — APIs, data models, integrations and background jobs built for reliability, observability and real load.",
    highlights: [
      { title: "Modelled properly", body: "A schema that reflects the business and survives contact with it." },
      { title: "Observable", body: "Structured logging and error reporting from day one." },
      { title: "Safe to change", body: "Versioned migrations and tests around what matters." },
    ],
    deliverables: [
      { name: "Data model & migrations", description: "A schema designed for the domain, with a versioned migration path." },
      { name: "API layer", description: "REST or GraphQL endpoints, documented, versioned and typed." },
      { name: "Authentication & roles", description: "Sessions, permissions and role-based access appropriate to the product." },
      { name: "Third-party integrations", description: "Payments, CRM, shipping, ERP and whatever else the business already runs on." },
      { name: "Jobs & scheduling", description: "Queues and background work for anything that must not block a request." },
      { name: "Observability", description: "Structured logs, error tracking and the health checks that make an incident short." },
    ],
    stack: ["Node.js", "TypeScript", "PHP", "Laravel", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "NGINX", "Stripe", "Webhooks"],
    related: ["nodejs-development", "php-development", "custom-software-development"],
  },
  {
    slug: "open-source-development",
    label: "Open Source Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "Open source\ndevelopment.",
    summary:
      "Building on stacks you are not locked into. Open-source foundations mean no per-seat licence deciding your roadmap and no vendor deciding when you migrate — provided somebody sets them up properly in the first place.",
    description:
      "Open source development from Premium Web Agency — building on open stacks so you keep ownership, portability and control of your roadmap.",
    highlights: [
      { title: "No lock-in", body: "Your stack stays portable and your data stays yours." },
      { title: "Audited dependencies", body: "Chosen for maintenance and licence, not for stars." },
      { title: "Upgrade path", body: "A documented route to the next major version." },
    ],
    deliverables: [
      { name: "Stack selection", description: "An honest comparison of the real options, with the trade-offs written down." },
      { name: "Licence review", description: "What each dependency permits, so nothing surprises your legal team later." },
      { name: "Implementation", description: "Configured and extended along the grain of the framework, not against it." },
      { name: "Custom modules", description: "Bespoke extensions where the ecosystem does not already cover the need." },
      { name: "Update strategy", description: "How and when this gets patched, and who does it." },
      { name: "Documentation", description: "Setup, deployment and architecture notes your own team can follow." },
    ],
    stack: ["Laravel", "Node.js", "Drupal", "WordPress", "React", "PostgreSQL", "MySQL", "Docker", "Linux", "NGINX", "Git"],
    related: ["php-development", "drupal-development", "cms-development"],
  },
  {
    slug: "php-development",
    label: "PHP Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "PHP\ndevelopment.",
    summary:
      "Modern PHP, written the way the language is actually written now — typed, tested, composer-managed and running on a current runtime. Also the pragmatic choice for the enormous amount of the web that already runs on it and needs to keep doing so.",
    description:
      "PHP development from Premium Web Agency — modern, typed, tested PHP for new builds and for bringing existing applications back up to a supported runtime.",
    highlights: [
      { title: "Modern PHP", body: "Typed, tested and on a supported version — not PHP as it was in 2012." },
      { title: "Legacy welcome", body: "Existing applications audited, upgraded and stabilised." },
      { title: "Hosting-friendly", body: "Runs where you already host, without exotic infrastructure." },
    ],
    deliverables: [
      { name: "Application build", description: "New PHP applications structured around a framework rather than around a folder of includes." },
      { name: "Legacy audit", description: "What is actually in the codebase, what is risky, and what upgrading really costs." },
      { name: "Version upgrade", description: "Moving off an unsupported runtime without losing behaviour along the way." },
      { name: "Database work", description: "Schema design, query tuning and migrations." },
      { name: "Integrations", description: "Payments, mail, CRM and third-party APIs wired in and monitored." },
      { name: "Deployment", description: "Repeatable deploys rather than files dragged over FTP." },
    ],
    stack: ["PHP 8", "Laravel", "Symfony", "Composer", "MySQL", "PostgreSQL", "Redis", "PHPUnit", "Docker", "NGINX", "Apache"],
    related: ["laravel-development", "back-end-development", "cms-development"],
  },
  {
    slug: "laravel-development",
    label: "Laravel Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "Laravel\ndevelopment.",
    summary:
      "Laravel is the fastest way we know to get a serious PHP application from nothing to production without inventing the plumbing. Queues, auth, mail, scheduling and migrations come with the framework — which means the budget goes into your product instead of into rebuilding what already exists.",
    description:
      "Laravel development from Premium Web Agency — production applications, APIs and dashboards built on Laravel's conventions, queues, auth and migrations.",
    highlights: [
      { title: "Convention first", body: "Built along the framework's grain, so any Laravel developer can pick it up." },
      { title: "Batteries included", body: "Queues, auth, scheduling and mail configured properly, not reinvented." },
      { title: "Tested", body: "Feature tests around the paths that would cost you money." },
    ],
    deliverables: [
      { name: "Application architecture", description: "Models, services and boundaries laid out so the app stays legible at scale." },
      { name: "Admin & dashboards", description: "Internal tooling your team runs the business from." },
      { name: "API development", description: "Versioned, authenticated APIs for apps and partners." },
      { name: "Queues & scheduling", description: "Background jobs, retries and cron work that fails loudly rather than silently." },
      { name: "Testing", description: "Feature and unit coverage on the flows that matter most." },
      { name: "Deployment pipeline", description: "Zero-downtime deploys, migrations and rollback." },
    ],
    stack: ["Laravel", "PHP 8", "Livewire", "Inertia", "Eloquent", "MySQL", "PostgreSQL", "Redis", "Horizon", "Pest", "Docker"],
    related: ["php-development", "back-end-development", "custom-software-development"],
  },
  {
    slug: "nodejs-development",
    label: "Node.js Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "Node.js\ndevelopment.",
    summary:
      "One language across the whole stack, and a runtime that is genuinely good at the thing most products need — many concurrent connections doing very little each. Real-time features, APIs and services, written in TypeScript so the contracts hold.",
    description:
      "Node.js development from Premium Web Agency — TypeScript APIs, real-time services and server-side rendering built for concurrency and shared types.",
    highlights: [
      { title: "One language", body: "Types shared between server and client instead of re-declared." },
      { title: "Built for concurrency", body: "The right runtime for real-time and I/O-heavy work." },
      { title: "Deploys anywhere", body: "Containerised, serverless or on your own metal." },
    ],
    deliverables: [
      { name: "API services", description: "REST and GraphQL services with typed contracts end to end." },
      { name: "Real-time features", description: "Sockets and event streams for chat, presence, live data and notifications." },
      { name: "Server-side rendering", description: "Next.js applications rendered for speed and for search engines." },
      { name: "Integration layer", description: "A service that talks to everything else so your front end does not have to." },
      { name: "Background workers", description: "Queues and scheduled jobs with retry and dead-letter handling." },
      { name: "Containerisation", description: "Docker images and the pipeline that ships them." },
    ],
    stack: ["Node.js", "TypeScript", "Next.js", "Express", "NestJS", "Prisma", "PostgreSQL", "MongoDB", "Redis", "Socket.IO", "Docker"],
    related: ["back-end-development", "front-end-development", "web-app-development"],
  },
  {
    slug: "drupal-development",
    label: "Drupal Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "Drupal\ndevelopment.",
    summary:
      "For sites with genuinely complicated content — many types, many languages, many editors and real permissions between them. Drupal earns its complexity exactly where a lighter CMS starts breaking, and is wasted everywhere else. We will tell you which one you have.",
    description:
      "Drupal development from Premium Web Agency — structured content models, editorial workflows, multilingual sites and custom modules on Drupal.",
    highlights: [
      { title: "Structured content", body: "Content modelled as data, reusable across every channel." },
      { title: "Real editorial control", body: "Roles, permissions and review workflows that match your org." },
      { title: "Multilingual", body: "Translation handled as a first-class concern." },
    ],
    deliverables: [
      { name: "Content architecture", description: "Types, fields, taxonomy and relationships designed before anything is built." },
      { name: "Custom modules", description: "Bespoke functionality written to Drupal standards so it survives upgrades." },
      { name: "Theming", description: "A front end built to your design system rather than a bought theme." },
      { name: "Migration", description: "Moving content in from an older site or Drupal version with its structure intact." },
      { name: "Editorial workflow", description: "Roles, moderation states and review paths configured for how your team works." },
      { name: "Performance & caching", description: "Caching layers and query tuning for content-heavy sites." },
    ],
    stack: ["Drupal 10", "PHP 8", "Twig", "Composer", "Drush", "MySQL", "PostgreSQL", "Redis", "Varnish", "Solr", "Docker"],
    related: ["cms-development", "php-development", "open-source-development"],
  },
  {
    slug: "cms-development",
    label: "CMS Development",
    category: "engineering",
    track: "build",
    eyebrow: "Engineering",
    title: "CMS\ndevelopment.",
    summary:
      "A content system your team can operate without calling us. That means modelling content as structured data rather than as pages of soup, and building an editing surface where the obvious action is the correct one.",
    description:
      "CMS development from Premium Web Agency — structured content models, headless or traditional, with an editing experience your team can actually operate.",
    highlights: [
      { title: "Editors first", body: "An admin designed for the people who use it daily." },
      { title: "Structured, not soup", body: "Content modelled as data, reusable anywhere." },
      { title: "Headless or classic", body: "Whichever your team and channels actually need." },
    ],
    deliverables: [
      { name: "Content model", description: "Types, fields and relationships that reflect how your content really works." },
      { name: "Editor experience", description: "Previews, validation and sensible defaults so the right thing is the easy thing." },
      { name: "Headless API", description: "Content delivered to web, app and any other surface from one source." },
      { name: "Roles & permissions", description: "Who can draft, who can publish, and what needs review first." },
      { name: "Content migration", description: "Existing content brought over with its structure and its URLs." },
      { name: "Training & manual", description: "A walkthrough and a written manual, as our technical support policy sets out." },
    ],
    stack: ["WordPress", "Drupal", "Strapi", "Sanity", "Payload", "Next.js", "GraphQL", "MySQL", "PostgreSQL", "Docker"],
    related: ["drupal-development", "custom-web-development", "content-writing"],
  },

  // ------------------------------------------------------------ Commerce & Product
  {
    slug: "ecommerce-solutions",
    label: "E-commerce Solutions",
    category: "commerce",
    track: "build",
    eyebrow: "Commerce",
    title: "E-commerce\nsolutions.",
    summary:
      "Stores engineered to be finished, not browsed. Most lost revenue in e-commerce is not a traffic problem — it is a checkout that asks too much, a search that finds nothing, and a product page that answers the wrong question.",
    description:
      "E-commerce solutions from Premium Web Agency — platform selection, storefront build, checkout optimisation, payments and fulfilment integration.",
    highlights: [
      { title: "Checkout first", body: "The funnel designed backwards from the paying moment." },
      { title: "Findable catalogue", body: "Search, filtering and merchandising that surface the right product." },
      { title: "Connected", body: "Payments, tax, shipping and stock wired to your real systems." },
    ],
    deliverables: [
      { name: "Platform selection", description: "An honest recommendation between hosted and self-hosted, with the trade-offs stated." },
      { name: "Storefront build", description: "Category, product and cart experiences designed to convert on mobile first." },
      { name: "Checkout optimisation", description: "Fewer steps, fewer fields, and the payment methods your customers expect." },
      { name: "Payments & tax", description: "Gateways, wallets, currencies and tax rules configured and tested." },
      { name: "Fulfilment integration", description: "Stock, shipping rates, labels and returns connected to your operation." },
      { name: "Analytics & tracking", description: "Commerce events and attribution instrumented so decisions have data." },
    ],
    stack: ["Shopify", "WooCommerce", "Magento", "OpenCart", "Stripe", "PayPal", "Klarna", "Algolia", "GA4", "Klaviyo"],
    related: ["shopify", "woocommerce", "magento"],
  },
  {
    slug: "shopify",
    label: "Shopify",
    category: "commerce",
    track: "build",
    eyebrow: "Commerce",
    title: "Shopify\nbuilds.",
    summary:
      "When you would rather sell than run infrastructure. Shopify handles PCI, uptime and payments; we handle the part that is actually yours — the storefront, the merchandising and the apps that make your operation work.",
    description:
      "Shopify development from Premium Web Agency — custom themes, headless storefronts, app integration and migrations onto Shopify.",
    highlights: [
      { title: "Custom, not bought", body: "A theme built to your brand instead of a marketplace skin." },
      { title: "Fast storefront", body: "Apps and scripts audited, because each one costs you speed." },
      { title: "Migration-safe", body: "Products, customers, orders and URLs brought across intact." },
    ],
    deliverables: [
      { name: "Custom theme", description: "Built on Online Store 2.0 sections so your team can compose pages without a developer." },
      { name: "Headless storefront", description: "Hydrogen or Next.js on the Storefront API where the brand needs more than a theme allows." },
      { name: "App stack review", description: "What each installed app costs you in speed and in subscription, and what can go." },
      { name: "Migration", description: "Products, customers, order history and redirects moved without losing search equity." },
      { name: "Checkout extensions", description: "Checkout customisation within what the platform actually permits." },
      { name: "Subscriptions & B2B", description: "Recurring orders, wholesale pricing and customer-specific catalogues." },
    ],
    stack: ["Shopify", "Liquid", "Online Store 2.0", "Hydrogen", "Storefront API", "Shopify Functions", "Klaviyo", "Stripe", "Next.js"],
    related: ["ecommerce-solutions", "woocommerce", "magento"],
  },
  {
    slug: "magento",
    label: "Magento",
    category: "commerce",
    track: "build",
    eyebrow: "Commerce",
    title: "Magento\ndevelopment.",
    summary:
      "For catalogues and rules that break simpler platforms — many stores, many price lists, complex B2B terms, deep ERP integration. Magento is heavy, and it is worth it precisely when you have outgrown the alternatives.",
    description:
      "Magento and Adobe Commerce development from Premium Web Agency — multi-store setups, B2B pricing, ERP integration and performance work.",
    highlights: [
      { title: "Built for complexity", body: "Multi-store, multi-currency and multi-catalogue as standard." },
      { title: "B2B ready", body: "Company accounts, quotes and negotiated pricing." },
      { title: "Tuned", body: "Caching and indexing configured for large catalogues." },
    ],
    deliverables: [
      { name: "Store architecture", description: "Websites, stores and views structured for your markets and brands." },
      { name: "Theme development", description: "A front end built to your design system on Magento's structure." },
      { name: "Custom extensions", description: "Modules written to Magento standards so upgrades stay possible." },
      { name: "ERP & PIM integration", description: "Stock, pricing and product data synchronised with the systems of record." },
      { name: "B2B configuration", description: "Company accounts, tiered pricing, quotes and purchase approvals." },
      { name: "Performance work", description: "Full-page cache, indexing strategy and query tuning for large catalogues." },
    ],
    stack: ["Magento 2", "Adobe Commerce", "PHP 8", "MySQL", "Elasticsearch", "Redis", "Varnish", "RabbitMQ", "Composer", "Docker"],
    related: ["ecommerce-solutions", "shopify", "opencart"],
  },
  {
    slug: "opencart",
    label: "OpenCart",
    category: "commerce",
    track: "build",
    eyebrow: "Commerce",
    title: "OpenCart\ndevelopment.",
    summary:
      "A light, open-source store you own outright, with no platform fee taking a slice of every order. It suits a focused catalogue and a team that wants control of its own hosting — and we will say so if your requirements have outgrown it.",
    description:
      "OpenCart development from Premium Web Agency — custom themes, extensions, payment integration and upgrades on a store you own outright.",
    highlights: [
      { title: "No platform fee", body: "Self-hosted, so the transaction cost is the gateway's alone." },
      { title: "Light to run", body: "Modest hosting requirements for a focused catalogue." },
      { title: "Fully yours", body: "Open source, so nothing about your roadmap is a vendor's decision." },
    ],
    deliverables: [
      { name: "Store setup", description: "Installation, catalogue structure, tax and shipping configured properly." },
      { name: "Custom theme", description: "A storefront built to your brand rather than a marketplace template." },
      { name: "Extension development", description: "Bespoke modules where the marketplace does not cover the requirement." },
      { name: "Payment & shipping", description: "Regional gateways and carriers integrated and tested end to end." },
      { name: "Version upgrade", description: "Moving off an old OpenCart release with customisations preserved." },
      { name: "Performance & security", description: "Caching, image handling and hardening for a self-hosted store." },
    ],
    stack: ["OpenCart", "PHP 8", "MySQL", "Twig", "jQuery", "NGINX", "Redis", "Stripe", "PayPal"],
    related: ["ecommerce-solutions", "woocommerce", "magento"],
  },
  {
    slug: "woocommerce",
    label: "WooCommerce",
    category: "commerce",
    track: "build",
    eyebrow: "Commerce",
    title: "WooCommerce\ndevelopment.",
    summary:
      "Commerce attached to the content engine you already run. If WordPress is where your marketing lives, Woo keeps the store and the story in one place — and keeps the whole thing on infrastructure you control.",
    description:
      "WooCommerce development from Premium Web Agency — custom stores on WordPress with content and commerce in one system you own.",
    highlights: [
      { title: "Content and commerce", body: "One system for the store and the marketing around it." },
      { title: "Self-hosted", body: "Your server, your data, no per-order platform cut." },
      { title: "Extensible", body: "Custom behaviour through hooks rather than plugin sprawl." },
    ],
    deliverables: [
      { name: "Store build", description: "Products, variations, tax and shipping configured for how you actually sell." },
      { name: "Custom theme", description: "A storefront built from your design system, block-based where it helps editors." },
      { name: "Plugin audit", description: "What every active plugin costs in speed, licence and risk — and what can go." },
      { name: "Custom development", description: "Bespoke functionality written against Woo's hooks so updates stay safe." },
      { name: "Payments & subscriptions", description: "Gateways, wallets and recurring billing configured and tested." },
      { name: "Speed & hardening", description: "Caching, image optimisation and security appropriate to a self-hosted store." },
    ],
    stack: ["WooCommerce", "WordPress", "PHP 8", "MySQL", "Elementor", "Gutenberg", "Stripe", "PayPal", "Redis", "NGINX"],
    related: ["ecommerce-solutions", "shopify", "cms-development"],
  },
  {
    slug: "web-app-development",
    label: "Web App Development",
    category: "commerce",
    track: "build",
    eyebrow: "Product",
    title: "Web app\ndevelopment.",
    summary:
      "Software that happens to run in a browser. Dashboards, portals and internal tools where the hard part is not the marketing page but the state, the permissions and the twelve edge cases that decide whether people trust it.",
    description:
      "Web app development from Premium Web Agency — dashboards, portals and internal tools with real auth, roles, state and offline-tolerant behaviour.",
    highlights: [
      { title: "Real state", body: "Loading, empty, error and offline treated as designed states." },
      { title: "Roles and permissions", body: "Access modelled to match how the organisation works." },
      { title: "Built to grow", body: "Architecture that survives the second and third feature wave." },
    ],
    deliverables: [
      { name: "Product architecture", description: "Data model, state strategy and module boundaries decided before feature work." },
      { name: "Authentication & roles", description: "Sign-in, sessions, SSO where needed and granular permissions." },
      { name: "Core interface", description: "The screens the work actually happens on, built as a component system." },
      { name: "Data & reporting", description: "Tables, filtering, exports and the dashboards people check daily." },
      { name: "Integrations", description: "The other systems the app has to speak to, wired and monitored." },
      { name: "Testing & release", description: "Automated coverage on critical paths and a repeatable deployment pipeline." },
    ],
    stack: ["TypeScript", "React", "Next.js", "Node.js", "Laravel", "PostgreSQL", "Redis", "Prisma", "Playwright", "Docker"],
    related: ["custom-software-development", "front-end-development", "minimum-viable-products"],
  },
  {
    slug: "minimum-viable-products",
    label: "Minimum Viable Products",
    category: "commerce",
    track: "build",
    eyebrow: "Product",
    title: "Minimum viable\nproducts.",
    summary:
      "The smallest honest version of the idea — small in scope, not in quality. The point of an MVP is to find out whether anyone wants this before the expensive version gets built, which only works if what you ship is good enough to judge fairly.",
    description:
      "MVP development from Premium Web Agency — the smallest honest version of your product, scoped to test demand and built well enough to judge.",
    highlights: [
      { title: "Scoped ruthlessly", body: "One core loop, built properly. Everything else waits." },
      { title: "Instrumented", body: "The metric that decides the next step, wired in from launch." },
      { title: "Not a throwaway", body: "A foundation worth keeping if the answer is yes." },
    ],
    deliverables: [
      { name: "Scope definition", description: "The single hypothesis being tested, and the feature list cut down to it." },
      { name: "Rapid prototype", description: "A clickable version to react to before code is committed." },
      { name: "Core build", description: "The one loop that matters, built to a standard you could keep." },
      { name: "Analytics", description: "The events and funnels that will actually answer the question." },
      { name: "Launch support", description: "Deployment, a feedback path and monitoring for the first weeks." },
      { name: "Roadmap", description: "What we learned, and the honest options for what comes next." },
    ],
    stack: ["Next.js", "TypeScript", "React", "Supabase", "PostgreSQL", "Stripe", "Vercel", "Figma", "PostHog"],
    related: ["interactive-prototypes", "web-app-development", "custom-software-development"],
  },
  {
    slug: "custom-software-development",
    label: "Custom Software Development",
    category: "commerce",
    track: "build",
    eyebrow: "Product",
    title: "Custom software\ndevelopment.",
    summary:
      "For the process that is genuinely yours. When a business runs on a spreadsheet nobody dares touch and three tools that do not speak to each other, the fix is usually software shaped like the actual operation rather than another subscription it has to be bent into.",
    description:
      "Custom software development from Premium Web Agency — bespoke internal systems, integrations and automation built around your real operation.",
    highlights: [
      { title: "Shaped to the work", body: "Software that matches the process instead of replacing it badly." },
      { title: "Integrated", body: "Talks to the systems you already depend on." },
      { title: "Documented", body: "Handover your own team or your next vendor can act on." },
    ],
    deliverables: [
      { name: "Process mapping", description: "How the work is really done today, including the parts that live in someone's head." },
      { name: "Solution design", description: "What gets automated, what stays manual, and an honest build-versus-buy view." },
      { name: "Application build", description: "The system itself, delivered in increments you can use as they land." },
      { name: "Systems integration", description: "Accounting, CRM, ERP and whatever else holds the data of record." },
      { name: "Migration", description: "Getting years of existing data in without losing its meaning." },
      { name: "Training & documentation", description: "A walkthrough and a written manual for the people who will run it." },
    ],
    stack: ["TypeScript", "Node.js", "Laravel", "PostgreSQL", "MySQL", "Redis", "Docker", "REST", "Webhooks", "Power BI"],
    related: ["web-app-development", "intelligent-workflows", "back-end-development"],
  },
  {
    slug: "interactive-prototypes",
    label: "Interactive Prototypes",
    category: "commerce",
    track: "design",
    eyebrow: "Product",
    title: "Interactive\nprototypes.",
    summary:
      "Something to click before something to build. A prototype settles arguments that a static mockup cannot — how the flow feels, where people hesitate, and whether the idea survives contact with a real thumb.",
    description:
      "Interactive prototypes from Premium Web Agency — clickable, testable prototypes that resolve flow and interaction questions before build.",
    highlights: [
      { title: "Decisions before code", body: "Settle the flow while changing it is still cheap." },
      { title: "Testable", body: "Real enough to put in front of real users." },
      { title: "Carries into build", body: "Becomes the reference the developers work from." },
    ],
    deliverables: [
      { name: "Flow mapping", description: "The journeys worth prototyping, and the decisions each one has to resolve." },
      { name: "Wireframe prototype", description: "Low-fidelity and clickable, for structure before surface." },
      { name: "High-fidelity prototype", description: "Branded, animated and close enough to judge fairly." },
      { name: "Micro-interaction spec", description: "Timings, easings and states, written down so the build matches." },
      { name: "User testing", description: "Sessions against the prototype, with what we saw rather than what we hoped." },
      { name: "Build-ready handoff", description: "Annotated screens and the spec developers actually need." },
    ],
    stack: ["Figma", "ProtoPie", "Framer", "Motion", "Rive", "Maze", "Lottie"],
    related: ["ux-ui-design", "minimum-viable-products", "mobile-app-design"],
  },

  // -------------------------------------------------------------- Design & Growth
  {
    slug: "website-design",
    label: "Website Design",
    category: "studio",
    track: "design",
    eyebrow: "Design",
    title: "Website\ndesign.",
    summary:
      "A site that looks like the business is run well. Design here is not decoration — it is hierarchy, pace and restraint, deciding what a visitor understands in the first five seconds and what they are able to do next.",
    description:
      "Website design from Premium Web Agency — hierarchy, pace and a design system that keeps every page coherent as the site grows.",
    highlights: [
      { title: "Hierarchy first", body: "What matters is obvious before anything is read." },
      { title: "A system, not screens", body: "Rules that hold up on page fifty." },
      { title: "Built to build", body: "Designed with the constraints of the medium in mind." },
    ],
    deliverables: [
      { name: "Discovery & audit", description: "Business goals, audience and an honest read on what exists today." },
      { name: "Sitemap & wireframes", description: "Structure and hierarchy agreed before any visual direction." },
      { name: "Visual direction", description: "Concepts within your package's revision allowance, iterated until right." },
      { name: "Full page design", description: "Every template and state, responsive across the breakpoints that matter." },
      { name: "Design system", description: "Type scale, colour, spacing, components and motion rules." },
      { name: "Developer handoff", description: "Source files, exported assets and specs a build can be run from." },
    ],
    stack: ["Figma", "Adobe CC", "Motion", "Lottie", "Tailwind CSS", "Webflow", "Maze"],
    related: ["ux-ui-design", "brand-identity", "front-end-development"],
  },
  {
    slug: "ux-ui-design",
    label: "UX & UI Design",
    category: "studio",
    track: "design",
    eyebrow: "Design",
    title: "UX & UI\ndesign.",
    summary:
      "UX is whether it works; UI is whether it is worth touching. Both matter, and they fail differently — a beautiful interface over a confused flow still loses the user, and a sound flow rendered badly never gets trusted enough to try.",
    description:
      "UX and UI design from Premium Web Agency — research, flows, interface systems and accessible, tested interaction design.",
    highlights: [
      { title: "Evidence, not taste", body: "Decisions defended with research, not preference." },
      { title: "Accessible", body: "Contrast, target sizes and keyboard paths designed in." },
      { title: "Systematised", body: "Components and states documented for build." },
    ],
    deliverables: [
      { name: "User research", description: "Interviews, competitor review and analytics read together rather than separately." },
      { name: "Personas & journeys", description: "Who this is for and what they are trying to finish." },
      { name: "Information architecture", description: "Navigation, taxonomy and structure that match how people look for things." },
      { name: "Wireframes & flows", description: "Every screen and every state, including the empty and error ones." },
      { name: "UI system", description: "Components, tokens and interaction rules as a documented library." },
      { name: "Usability testing", description: "Testing against the prototype, and the changes that came out of it." },
    ],
    stack: ["Figma", "FigJam", "Maze", "Hotjar", "GA4", "Storybook", "WCAG 2.2"],
    related: ["website-design", "interactive-prototypes", "mobile-app-design"],
  },
  {
    slug: "brand-identity",
    label: "Brand Identity",
    category: "studio",
    track: "design",
    eyebrow: "Design",
    title: "Brand\nidentity.",
    summary:
      "A mark is the smallest part of it. Identity is the whole recognisable system — type, colour, voice, imagery and the rules that keep them consistent when fifty different people are applying them without you in the room.",
    description:
      "Brand identity from Premium Web Agency — logo, type, colour, voice and the guidelines that keep it consistent across every application.",
    highlights: [
      { title: "System, not a logo", body: "Everything needed to apply the brand without you present." },
      { title: "Full ownership", body: "Final core files and complete rights on finalisation." },
      { title: "Made to be applied", body: "Tested against real surfaces before it is signed off." },
    ],
    deliverables: [
      { name: "Brand discovery", description: "Positioning, audience and the competitive set the mark has to stand apart from." },
      { name: "Logo design", description: "Concepts within your package's allowance, refined to a final mark." },
      { name: "Type & colour", description: "A typographic scale and palette with accessible contrast pairings." },
      { name: "Brand assets", description: "Icons, patterns, imagery direction and templates for the things you make often." },
      { name: "Guidelines", description: "How to use it, and the misuse cases spelled out so they do not happen." },
      { name: "Final files", description: "Vector core files in every format you will be asked for." },
    ],
    stack: ["Adobe Illustrator", "Figma", "Photoshop", "InDesign", "After Effects"],
    faqs: [
      {
        question: "Do we get full rights to the logo?",
        answer:
          "Yes. On written finalisation the final core files are delivered and 100% of the ownership rights are yours, to use as you see fit. Materials produced during the revision cycles leading to that final are not included.",
      },
    ],
    related: ["website-design", "content-writing", "ux-ui-design"],
  },
  {
    slug: "mobile-app-design",
    label: "Mobile App Design",
    category: "studio",
    track: "design",
    eyebrow: "Design",
    title: "Mobile app\ndesign.",
    summary:
      "Designed for a thumb, one hand, bad light and a spotty connection. Mobile punishes anything decorative — the interface has to survive interruption, and every tap has to be reachable without a second hand.",
    description:
      "Mobile app design from Premium Web Agency — iOS and Android interfaces designed to platform conventions, for one-handed use and real conditions.",
    highlights: [
      { title: "Platform-native", body: "Follows iOS and Android conventions instead of fighting them." },
      { title: "Thumb-first", body: "Reach, target size and one-handed use designed for." },
      { title: "Handoff-ready", body: "Specs, states and assets at every density." },
    ],
    deliverables: [
      { name: "Platform strategy", description: "Where the two platforms should differ, and where consistency matters more." },
      { name: "User flows", description: "Onboarding, the core loop, permissions and the paths back out." },
      { name: "Screen design", description: "Every screen and state, at the densities each platform requires." },
      { name: "Interaction & motion", description: "Gestures, transitions and feedback specified rather than left to interpretation." },
      { name: "Component library", description: "A reusable system so later features stay consistent." },
      { name: "Store assets", description: "Icon, screenshots and listing artwork built to store requirements." },
    ],
    stack: ["Figma", "ProtoPie", "Lottie", "Human Interface Guidelines", "Material Design", "TestFlight"],
    related: ["ios-development", "android-development", "ux-ui-design"],
  },
  {
    slug: "seo-marketing",
    label: "SEO Marketing",
    category: "studio",
    track: "growth",
    eyebrow: "Growth",
    title: "SEO\nmarketing.",
    summary:
      "Being findable by the people already looking. SEO compounds slowly and honestly: technical foundations, content that answers a real question, and authority earned rather than bought. Anyone promising page one next month is selling something else.",
    description:
      "SEO marketing from Premium Web Agency — technical foundations, content strategy and authority building, reported against a recorded baseline.",
    highlights: [
      { title: "Technical first", body: "Crawlability and speed fixed before anything is published." },
      { title: "Intent-led", body: "Content mapped to what people are actually searching for." },
      { title: "Measured honestly", body: "Reported against a baseline recorded at the start." },
    ],
    deliverables: [
      { name: "Technical audit", description: "Crawl, index, speed, structured data and the errors quietly costing you." },
      { name: "Keyword & intent mapping", description: "What your audience searches, and which page should answer each thing." },
      { name: "On-page optimisation", description: "Titles, structure, internal linking and schema across the site." },
      { name: "Content plan", description: "A calendar built around intent gaps rather than around volume." },
      { name: "Authority building", description: "Digital PR and links earned on merit, not bought from a network." },
      { name: "Reporting", description: "Rankings, traffic and conversions against the opening baseline." },
    ],
    stack: ["Google Search Console", "GA4", "Ahrefs", "Semrush", "Screaming Frog", "Schema.org", "PageSpeed Insights"],
    related: ["content-writing", "digital-marketing", "ppc-marketing"],
  },
  {
    slug: "ppc-marketing",
    label: "PPC Marketing",
    category: "studio",
    track: "growth",
    eyebrow: "Growth",
    title: "PPC\nmarketing.",
    summary:
      "Paid media buys you data faster than anything else — and burns money faster too. The discipline is knowing which number you are optimising for, and being willing to switch off the campaign that flatters the dashboard but does not sell.",
    description:
      "PPC marketing from Premium Web Agency — search, shopping, social and retargeting campaigns built around conversion, not clicks.",
    highlights: [
      { title: "Conversion, not clicks", body: "Optimised toward revenue rather than traffic." },
      { title: "Tracked properly", body: "Conversion tracking verified before spend starts." },
      { title: "Landing pages too", body: "The ad and the page it lands on treated as one thing." },
    ],
    deliverables: [
      { name: "Account audit", description: "Structure, wasted spend and tracking accuracy in what is running today." },
      { name: "Campaign architecture", description: "Accounts, campaigns and ad groups structured so the data stays readable." },
      { name: "Keyword & audience research", description: "What to bid on, and the negatives that stop the budget leaking." },
      { name: "Ad creative", description: "Copy and creative variants built for testing, not for a single guess." },
      { name: "Landing pages", description: "Pages designed for the specific promise the ad made." },
      { name: "Optimisation & reporting", description: "Bid, budget and creative decisions on a cadence, with the reasoning shown." },
    ],
    stack: ["Google Ads", "Microsoft Ads", "Meta Ads", "LinkedIn Ads", "GA4", "Google Tag Manager", "Merchant Center"],
    related: ["digital-marketing", "seo-marketing", "smm-marketing"],
  },
  {
    slug: "smm-marketing",
    label: "SMM Marketing",
    category: "studio",
    track: "growth",
    eyebrow: "Growth",
    title: "Social media\nmarketing.",
    summary:
      "Being worth following. Social rewards consistency and a recognisable point of view far more than volume — which means a real calendar, a real voice, and someone actually answering when people reply.",
    description:
      "Social media marketing from Premium Web Agency — strategy, content calendars, creative production and community management.",
    highlights: [
      { title: "One voice", body: "A recognisable point of view across every channel." },
      { title: "Consistent", body: "A calendar that survives a busy month." },
      { title: "Two-way", body: "Community management, not just broadcasting." },
    ],
    deliverables: [
      { name: "Channel strategy", description: "Which platforms deserve your effort, and which are a tax on it." },
      { name: "Content calendar", description: "Themes, formats and a publishing rhythm planned in advance." },
      { name: "Creative production", description: "Static, motion and short-form video built to each platform's shape." },
      { name: "Copywriting", description: "Captions and hooks in a voice that stays the same across channels." },
      { name: "Community management", description: "Replies, comments and messages handled inside agreed hours." },
      { name: "Performance reporting", description: "Reach, engagement and what actually sent traffic or revenue." },
    ],
    stack: ["Meta Business Suite", "LinkedIn", "TikTok", "Instagram", "Buffer", "Canva", "Adobe Premiere"],
    related: ["digital-marketing", "content-writing", "ppc-marketing"],
  },
  {
    slug: "content-writing",
    label: "Content Writing",
    category: "studio",
    track: "growth",
    eyebrow: "Growth",
    title: "Content\nwriting.",
    summary:
      "Words that carry the weight the design cannot. Most sites do not have a traffic problem so much as a clarity problem — the visitor arrives, cannot tell what is being offered, and leaves. Good copy is mostly deciding what to cut.",
    description:
      "Content writing from Premium Web Agency — website copy, articles, product content and messaging written for clarity and for search.",
    highlights: [
      { title: "Clear first", body: "Understood on the first read, not the third." },
      { title: "In your voice", body: "Written to a documented tone, not a generic one." },
      { title: "Search-aware", body: "Structured for intent without reading like it was." },
    ],
    deliverables: [
      { name: "Messaging framework", description: "Positioning, value propositions and proof points in a form the whole team can use." },
      { name: "Tone of voice", description: "How you sound, with examples of what is in bounds and what is not." },
      { name: "Website copy", description: "Every page, written to the design's hierarchy rather than poured into it." },
      { name: "Articles & long-form", description: "Researched pieces mapped to the search intent they are meant to answer." },
      { name: "Product & category copy", description: "Descriptions that answer the buying question at scale." },
      { name: "Editing & rewrite", description: "Existing copy cut down and sharpened where a rewrite is not warranted." },
    ],
    stack: ["Google Docs", "Surfer SEO", "Ahrefs", "Grammarly", "Notion", "Schema.org"],
    faqs: [
      {
        question: "Is content creation included in a website build?",
        answer:
          "Not by default. Populating a site with text and images is a separate purchase — if it is included in your package we create the copy specifically for your site and source licensed stock imagery for approval. Product images and product details come from you.",
      },
    ],
    related: ["seo-marketing", "website-design", "digital-marketing"],
  },
  {
    slug: "digital-marketing",
    label: "Digital Marketing",
    category: "studio",
    track: "growth",
    eyebrow: "Growth",
    title: "Digital\nmarketing.",
    summary:
      "The channels run as one system rather than five separate line items. Search, paid, social, email and content each do something the others cannot — the returns come from sequencing them deliberately instead of running them in parallel and hoping.",
    description:
      "Digital marketing from Premium Web Agency — search, paid, social, email and content run as one measured system with shared attribution.",
    highlights: [
      { title: "One system", body: "Channels sequenced deliberately, not run in parallel and hoped over." },
      { title: "Shared attribution", body: "One measurement model everything reports into." },
      { title: "Budget follows proof", body: "Spend moves toward what is demonstrably working." },
    ],
    deliverables: [
      { name: "Growth audit", description: "Current channels, spend, funnel and where the leaks actually are." },
      { name: "Channel strategy", description: "Budget split and sequencing, with what each channel is accountable for." },
      { name: "Measurement setup", description: "Analytics, tag management, events and attribution configured and verified." },
      { name: "Campaign execution", description: "Search, paid, social and email delivered against the calendar." },
      { name: "Conversion optimisation", description: "Landing page and funnel testing against a recorded baseline." },
      { name: "Reporting", description: "One dashboard covering every channel, reviewed on an agreed cadence." },
    ],
    stack: ["GA4", "Google Tag Manager", "Google Ads", "Meta Ads", "Klaviyo", "Mailchimp", "Looker Studio", "HubSpot"],
    related: ["seo-marketing", "ppc-marketing", "smm-marketing"],
  },

  // ------------------------------------------------------------------ Apps & AI
  {
    slug: "ios-development",
    label: "iOS Development",
    category: "apps",
    track: "build",
    eyebrow: "Apps",
    title: "iOS\ndevelopment.",
    summary:
      "Apps that feel like they belong on the device. iOS users notice when something is a website in a shell — the gestures are wrong, the transitions are late, and the whole thing sits slightly outside the platform it is running on.",
    description:
      "iOS development from Premium Web Agency — native and cross-platform iPhone and iPad apps built to Apple's conventions and review requirements.",
    highlights: [
      { title: "Feels native", body: "Platform gestures, transitions and conventions respected." },
      { title: "Review-ready", body: "Built against App Store requirements, not surprised by them." },
      { title: "Offline-tolerant", body: "Sensible behaviour when the connection is not." },
    ],
    deliverables: [
      { name: "Architecture", description: "Native or cross-platform decided on your actual constraints, with reasoning stated." },
      { name: "App build", description: "The product itself, built against Apple's interface guidelines." },
      { name: "API integration", description: "Sync, caching and offline behaviour that holds up on a bad connection." },
      { name: "Device features", description: "Notifications, biometrics, camera, location and in-app purchase where required." },
      { name: "Testing", description: "Automated coverage plus TestFlight distribution for your reviewers." },
      { name: "Store submission", description: "Listing, screenshots, privacy declarations and the review process handled." },
    ],
    stack: ["Swift", "SwiftUI", "React Native", "Expo", "TypeScript", "Xcode", "TestFlight", "Firebase", "App Store Connect"],
    related: ["android-development", "mobile-app-design", "web-app-development"],
  },
  {
    slug: "android-development",
    label: "Android Development",
    category: "apps",
    track: "build",
    eyebrow: "Apps",
    title: "Android\ndevelopment.",
    summary:
      "One app, an enormous range of hardware. Android's real difficulty is not the language — it is that your users are on six-year-old devices with small screens and less memory, and the app has to be good there too.",
    description:
      "Android development from Premium Web Agency — native and cross-platform apps tested across the device and OS range your users actually own.",
    highlights: [
      { title: "Tested across the range", body: "Not just on the newest flagship." },
      { title: "Material where it helps", body: "Platform conventions followed, brand kept intact." },
      { title: "Play-ready", body: "Policy, privacy and release tracks handled." },
    ],
    deliverables: [
      { name: "Architecture", description: "Native or cross-platform, chosen against your budget, team and roadmap." },
      { name: "App build", description: "The product, built to Material guidance where it serves the user." },
      { name: "Device coverage", description: "Screen sizes, densities and OS versions verified against your real audience." },
      { name: "Background & sync", description: "Work managers, notifications and sync that respect battery and data." },
      { name: "Testing", description: "Instrumented tests and staged rollout through internal and closed tracks." },
      { name: "Play Store release", description: "Listing, policy declarations, signing and release management." },
    ],
    stack: ["Kotlin", "Jetpack Compose", "React Native", "Expo", "TypeScript", "Android Studio", "Firebase", "Play Console"],
    related: ["ios-development", "mobile-app-design", "web-app-development"],
  },
  {
    slug: "game-development",
    label: "Game Development",
    category: "apps",
    track: "build",
    eyebrow: "Apps",
    title: "Game\ndevelopment.",
    summary:
      "Interactive work where the loop is the product. Casual games, branded experiences and playable marketing — built around a core loop that is worth repeating, because no amount of art rescues one that is not.",
    description:
      "Game development from Premium Web Agency — casual games, branded interactive experiences and playable marketing for web and mobile.",
    highlights: [
      { title: "Loop first", body: "The core mechanic proven before art is committed." },
      { title: "Runs on the web", body: "Playable without an install where that matters." },
      { title: "Instrumented", body: "Analytics on progression, drop-off and retention." },
    ],
    deliverables: [
      { name: "Concept & mechanics", description: "The core loop, progression and win conditions, defined and pressure-tested." },
      { name: "Playable prototype", description: "Grey-box build to prove the mechanic before anything is made pretty." },
      { name: "Art & animation", description: "Characters, environments and effects to an agreed direction." },
      { name: "Game build", description: "Levels, UI, audio, save state and the full loop implemented." },
      { name: "Performance tuning", description: "Frame rate and memory held on mid-range target hardware." },
      { name: "Release", description: "Web embed or store submission, with analytics wired in." },
    ],
    stack: ["Unity", "C#", "Three.js", "WebGL", "Phaser", "Blender", "Spine", "FMOD"],
    related: ["ar-vr-app-development", "ios-development", "android-development"],
  },
  {
    slug: "ar-vr-app-development",
    label: "AR/VR App Development",
    category: "apps",
    track: "build",
    eyebrow: "Apps",
    title: "AR & VR\ndevelopment.",
    summary:
      "Spatial work that has a reason to be spatial. AR earns its place when seeing something at real scale in a real room changes the decision — try-on, placement, training. Where it does not, it is an expensive novelty and we will say so.",
    description:
      "AR and VR development from Premium Web Agency — product visualisation, try-on, training and immersive experiences for web and headset.",
    highlights: [
      { title: "Only where it earns it", body: "Spatial where scale genuinely changes the decision." },
      { title: "Web-first where possible", body: "WebXR and AR Quick Look, no install required." },
      { title: "Comfort budgeted", body: "Frame rate treated as a safety constraint in VR." },
    ],
    deliverables: [
      { name: "Feasibility & concept", description: "Whether spatial actually helps here, on which devices, and at what cost." },
      { name: "3D asset pipeline", description: "Models optimised and formatted for real-time delivery at sensible file sizes." },
      { name: "AR experience", description: "Placement, scale and occlusion on the web or in a native app." },
      { name: "VR experience", description: "Immersive environments and interactions built with comfort budgeted in." },
      { name: "Integration", description: "Connected to your catalogue or training data rather than standing alone." },
      { name: "Device testing", description: "Verified across the headsets and phones your audience actually has." },
    ],
    stack: ["Unity", "WebXR", "Three.js", "React Three Fiber", "ARKit", "ARCore", "glTF", "Blender", "8th Wall"],
    related: ["game-development", "ios-development", "ai-product-integration"],
  },
  {
    slug: "ai-product-integration",
    label: "AI Product Integration",
    category: "apps",
    track: "build",
    eyebrow: "AI",
    title: "AI product\nintegration.",
    summary:
      "Intelligence inside the product, doing a specific job. Search that understands a question, support that answers from your own documentation, drafting that saves an hour — scoped narrowly, grounded in your data, and honest about what it cannot do.",
    description:
      "AI product integration from Premium Web Agency — semantic search, retrieval-grounded assistants and AI features scoped, evaluated and shipped safely.",
    highlights: [
      { title: "Grounded", body: "Answers retrieved from your content, with sources shown." },
      { title: "Evaluated", body: "Measured against a real test set, not a demo prompt." },
      { title: "Cost-aware", body: "Token spend modelled before launch, not discovered after." },
    ],
    deliverables: [
      { name: "Use-case scoping", description: "Which jobs are genuinely suited to a model, and which are better as ordinary code." },
      { name: "Data preparation", description: "Your content cleaned, chunked and embedded for retrieval." },
      { name: "Retrieval & grounding", description: "A pipeline that answers from your sources rather than from memory." },
      { name: "Feature build", description: "The interface around it, including how it behaves when it is unsure." },
      { name: "Evaluation", description: "A scored test set, so quality is measured rather than felt." },
      { name: "Guardrails & cost", description: "Rate limits, fallbacks, logging and a spend model you can forecast." },
    ],
    stack: ["Claude API", "OpenAI API", "TypeScript", "Next.js", "pgvector", "Pinecone", "LangChain", "Redis", "PostgreSQL"],
    related: ["ai-agents-automation", "intelligent-workflows", "web-app-development"],
  },
  {
    slug: "ai-agents-automation",
    label: "AI Agents & Automation",
    category: "apps",
    track: "build",
    eyebrow: "AI",
    title: "AI agents &\nautomation.",
    summary:
      "Software that takes an actual task off someone's desk. An agent is only worth building where the work is repetitive, the inputs are messy enough that rules alone fail, and a human still holds the decisions that carry consequences.",
    description:
      "AI agents and automation from Premium Web Agency — tool-using agents for repetitive work, with human approval on consequential steps.",
    highlights: [
      { title: "Bounded", body: "A defined task with defined tools, not an open-ended assistant." },
      { title: "Human in the loop", body: "Approval required wherever the action carries consequence." },
      { title: "Auditable", body: "Every run logged with its inputs, tools and output." },
    ],
    deliverables: [
      { name: "Task analysis", description: "What actually happens today, step by step, including the exceptions." },
      { name: "Agent design", description: "Tools, boundaries, escalation paths and what it is never allowed to do alone." },
      { name: "Tool integration", description: "Wired to the systems where the work really lives." },
      { name: "Review interface", description: "Where a person approves, corrects or rejects before anything commits." },
      { name: "Evaluation & monitoring", description: "Accuracy tracked over time, with alerting when it drifts." },
      { name: "Rollout", description: "Shadow mode first, then supervised, then live — with a way back at each stage." },
    ],
    stack: ["Claude API", "Model Context Protocol", "TypeScript", "Node.js", "Temporal", "PostgreSQL", "Redis", "Zapier", "n8n"],
    related: ["intelligent-workflows", "ai-product-integration", "custom-software-development"],
  },
  {
    slug: "intelligent-workflows",
    label: "Intelligent Workflows",
    category: "apps",
    track: "build",
    eyebrow: "AI",
    title: "Intelligent\nworkflows.",
    summary:
      "The joins between your systems, automated. Most operational drag is not one broken tool — it is the copy-paste between four working ones, and the fact that nobody notices when a step is silently skipped.",
    description:
      "Intelligent workflow automation from Premium Web Agency — connecting systems, routing work and removing the manual joins between tools.",
    highlights: [
      { title: "Joins the tools", body: "Automates the handoffs, not the software you already pay for." },
      { title: "Fails loudly", body: "Errors alert someone instead of disappearing." },
      { title: "Measured", body: "Time saved tracked against the baseline we recorded." },
    ],
    deliverables: [
      { name: "Workflow mapping", description: "Every step, handoff and wait state in the process as it is really run." },
      { name: "Automation design", description: "What to automate, what to leave alone, and where a person must stay." },
      { name: "Integration build", description: "The systems connected, with retries and idempotency where they matter." },
      { name: "Document intelligence", description: "Extraction and classification for the invoices, forms and email that arrive unstructured." },
      { name: "Exception handling", description: "What happens when something does not fit — routed to a human, not dropped." },
      { name: "Monitoring", description: "Dashboards, alerting and a record of what ran and what it did." },
    ],
    stack: ["Temporal", "n8n", "Zapier", "Make", "TypeScript", "Node.js", "Claude API", "PostgreSQL", "Webhooks"],
    related: ["ai-agents-automation", "custom-software-development", "ai-product-integration"],
  },
];

export const serviceBySlug = new Map(servicePages.map((s) => [s.slug, s]));

/** Footer labels are the contract between the nav and these pages. */
export const serviceByLabel = new Map(servicePages.map((s) => [s.label, s]));
