import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePage } from "@/components/services/ServicePage";
import { serviceBySlug, servicePages, tracks } from "@/data/service-pages";
import { site } from "@/data/site";

type Params = { params: Promise<{ slug: string }> };

/** All thirty-four are known at build time, so all thirty-four are static. */
export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) return {};

  const title = service.label;
  return {
    title,
    description: service.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      type: "article",
      url: `${site.url}/services/${service.slug}`,
      title: `${title} — ${site.name}`,
      description: service.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description: service.description,
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) notFound();

  const faqs = [...(service.faqs ?? []), ...tracks[service.track].faqs];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.label,
        serviceType: service.label,
        description: service.description,
        url: `${site.url}/services/${service.slug}`,
        provider: {
          "@type": "ProfessionalService",
          name: site.name,
          url: site.url,
        },
        areaServed: "Worldwide",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${service.label} deliverables`,
          itemListElement: service.deliverables.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item.name, description: item.description },
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: service.label,
            item: `${site.url}/services/${service.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ServicePage service={service} />
    </>
  );
}
