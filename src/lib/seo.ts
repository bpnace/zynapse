import type { Metadata } from "next";
import { getMarketingFaqItems } from "@/lib/content/faq";
import { getEnv } from "@/lib/env";
import {
  getMarketingRoute,
  indexableMarketingRoutes,
  type MarketingRoute,
} from "@/lib/seo-routes";

const env = getEnv();

export const siteConfig = {
  name: "Zynapse",
  legalContextName: "Codariq",
  description:
    "Zynapse hilft Brands, schneller bessere Video Creatives zu bekommen. Zynapse Core versteht Marke, Ziel und Zielgruppe, plant passende Creative-Szenarien und liefert geprüfte Creative Packs für Paid Social und Short Form.",
  url: env.siteUrl,
  language: "de",
  languageTag: "de",
  locale: "de_DE",
  contactEmail: "hello@zynapse.eu",
  logoPath: "/icon.png",
  openGraphImagePath: "/opengraph-image.png",
  twitterImagePath: "/twitter-image.png",
  publisher: "Zynapse",
  creator: "Codariq",
} as const;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type PageSchemaType =
  | "WebPage"
  | "AboutPage"
  | "ContactPage"
  | "CollectionPage";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  indexable?: boolean;
  openGraphType?: "website" | "article";
};

type SchemaNode = Record<string, unknown>;

type PageJsonLdInput = {
  title: string;
  description: string;
  path: string;
  pageType?: PageSchemaType;
  breadcrumbs?: BreadcrumbItem[];
  primaryEntity?: SchemaNode;
};

type ServiceJsonLdInput = {
  path: string;
  name: string;
  description: string;
  serviceType: string;
  audience?: string;
  offers?: ReturnType<typeof buildOfferJsonLd>;
};

type FaqJsonLdInput = {
  path: string;
  items: readonly {
    question: string;
    answer: string;
  }[];
};

type MarketingPageJsonLdOptions = {
  offers?: ReturnType<typeof buildOfferJsonLd>;
  primaryEntity?: SchemaNode;
};

export const indexableSitemapEntries = indexableMarketingRoutes.map((route) => ({
  path: route.path,
  pageFile: route.pageFile,
}));

function buildVerification(): Metadata["verification"] | undefined {
  const google = env.googleSiteVerification;
  const bing = env.bingSiteVerification;

  if (!google && !bing) {
    return undefined;
  }

  return {
    ...(google ? { google } : {}),
    ...(bing
      ? {
          other: {
            "msvalidate.01": bing,
          },
        }
      : {}),
  };
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function buildSiteMetadata(): Metadata {
  const openGraphImage = {
    url: absoluteUrl(siteConfig.openGraphImagePath),
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} Creative Pack Preview`,
  };

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    referrer: "strict-origin-when-cross-origin",
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    authors: [{ name: siteConfig.creator }],
    verification: buildVerification(),
    openGraph: {
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [openGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteUrl(siteConfig.twitterImagePath)],
    },
  };
}

export function buildMetadata({
  title,
  description,
  path,
  indexable = true,
  openGraphType = "website",
}: MetadataInput): Metadata {
  const defaults = buildSiteMetadata();
  const robots = buildRobots(indexable);

  return {
    ...defaults,
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots,
    openGraph: {
      ...(defaults.openGraph ?? {}),
      title,
      description,
      type: openGraphType,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      ...(defaults.twitter ?? {}),
      title,
      description,
    },
  };
}

export function buildRobots(indexable = true): NonNullable<Metadata["robots"]> {
  if (!indexable) {
    return {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    };
  }

  const previewDirectives = {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large" as const,
    "max-video-preview": -1,
  };

  return {
    ...previewDirectives,
    googleBot: previewDirectives,
  };
}

export function buildRootJsonLd() {
  const organizationId = absoluteUrl("/#organization");
  const websiteId = absoluteUrl("/#website");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        alternateName: siteConfig.legalContextName,
        url: siteConfig.url,
        description: siteConfig.description,
        email: siteConfig.contactEmail,
        parentOrganization: {
          "@type": "Organization",
          name: siteConfig.legalContextName,
        },
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(siteConfig.logoPath),
          width: 512,
          height: 512,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            email: siteConfig.contactEmail,
            availableLanguage: [siteConfig.languageTag],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.languageTag,
        publisher: {
          "@id": organizationId,
        },
      },
    ],
  };
}

export function buildMarketingMetadata(path: MarketingRoute["path"]): Metadata {
  const route = getMarketingRoute(path);

  return buildMetadata({
    title: route.title,
    description: route.description,
    path: route.path,
  });
}

export function buildMarketingPageJsonLd(
  path: MarketingRoute["path"],
  options: MarketingPageJsonLdOptions = {},
) {
  const route = getMarketingRoute(path);
  const primaryEntity =
    options.primaryEntity ??
    (route.service
      ? buildServiceJsonLd({
          path: route.path,
          name: route.service.name,
          description: route.description,
          serviceType: route.service.serviceType,
          audience: route.service.audience,
          offers: options.offers,
        })
      : undefined);

  return buildPageJsonLd({
    title: route.title,
    description: route.description,
    path: route.path,
    pageType: route.schemaType,
    breadcrumbs: route.breadcrumbLabel
      ? buildBreadcrumbs(route.breadcrumbLabel, route.path)
      : undefined,
    primaryEntity,
  });
}

export function getMarketingRouteFaqItems(path: MarketingRoute["path"]) {
  return getMarketingFaqItems(getMarketingRoute(path).faqKey);
}

export function buildMarketingFaqJsonLd(path: MarketingRoute["path"]) {
  const items = getMarketingRouteFaqItems(path);

  if (!items.length) {
    return null;
  }

  return buildFaqJsonLd({
    path,
    items,
  });
}

export function buildBreadcrumbs(name: string, path: string): BreadcrumbItem[] {
  return [
    { name: "Startseite", path: "/" },
    { name, path },
  ];
}

export function buildOfferJsonLd(
  offers: Array<{
    name: string;
    description: string;
    minPrice?: number;
    priceCurrency?: string;
    priceNote?: string;
  }>,
) {
  return offers.map((offer) => ({
    "@type": "Offer",
    name: offer.name,
    description: offer.description,
    ...(offer.minPrice !== undefined ? { price: offer.minPrice.toString() } : {}),
    ...(offer.priceCurrency ? { priceCurrency: offer.priceCurrency } : {}),
    ...(offer.priceNote
      ? {
          priceSpecification: {
            "@type": "PriceSpecification",
            description: offer.priceNote,
          },
        }
      : {}),
    availability: "https://schema.org/InStock",
    url: absoluteUrl("/pricing"),
  }));
}

export function buildServiceJsonLd({
  path,
  name,
  description,
  serviceType,
  audience,
  offers,
}: ServiceJsonLdInput) {
  return {
    "@type": "Service",
    "@id": absoluteUrl(`${path}#service`),
    name,
    description,
    serviceType,
    provider: {
      "@id": absoluteUrl("/#organization"),
    },
    areaServed: "DE",
    availableLanguage: [siteConfig.languageTag],
    url: absoluteUrl(path),
    ...(audience
      ? { audience: { "@type": "Audience", audienceType: audience } }
      : {}),
    ...(offers ? { offers } : {}),
  };
}

export function buildFaqJsonLd({ path, items }: FaqJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl(`${path}#faq`),
    url: absoluteUrl(path),
    inLanguage: siteConfig.languageTag,
    isPartOf: {
      "@id": absoluteUrl(`${path}#webpage`),
    },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildPageJsonLd({
  title,
  description,
  path,
  pageType = "WebPage",
  breadcrumbs,
  primaryEntity,
}: PageJsonLdInput) {
  const graph: SchemaNode[] = [
    {
      "@type": pageType,
      "@id": absoluteUrl(`${path}#webpage`),
      url: absoluteUrl(path),
      name: title,
      description,
      inLanguage: siteConfig.languageTag,
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      ...(primaryEntity?.["@id"]
        ? { mainEntity: { "@id": primaryEntity["@id"] } }
        : {}),
    },
  ];

  if (primaryEntity) {
    graph.push(primaryEntity);
  }

  if (breadcrumbs?.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": absoluteUrl(`${path}#breadcrumbs`),
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
