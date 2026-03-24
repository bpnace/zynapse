import type { Metadata } from "next";
import { getEnv } from "@/lib/env";

const env = getEnv();

export const siteConfig = {
  name: "Zynapse",
  legalContextName: "Codariq",
  description:
    "Zynapse verbindet Brands mit kuratierten AI-Spezialist:innen und übersetzt Briefings in lean koordinierte Kampagnen-Setups, markenfähige Varianten und klare Handover.",
  url: env.siteUrl,
  language: "de",
  languageTag: "de",
  locale: "de_DE",
  contactEmail: "hello@zynapse.eu",
  logoPath: "/android-chrome-512x512.png",
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

export const indexableSitemapEntries = [
  { path: "/", pageFile: "src/app/page.tsx" },
  { path: "/brands", pageFile: "src/app/brands/page.tsx" },
  { path: "/creatives", pageFile: "src/app/creatives/page.tsx" },
  { path: "/about", pageFile: "src/app/about/page.tsx" },
  { path: "/pricing", pageFile: "src/app/pricing/page.tsx" },
  { path: "/contact", pageFile: "src/app/contact/page.tsx" },
] as const;

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
    },
    twitter: {
      card: "summary_large_image",
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

export function buildPageJsonLd({
  title,
  description,
  path,
  pageType = "WebPage",
  breadcrumbs = [],
  primaryEntity,
}: PageJsonLdInput) {
  const graph: SchemaNode[] = [];
  const pageId = absoluteUrl(`${path}#webpage`);
  const breadcrumbId = absoluteUrl(`${path}#breadcrumb`);

  graph.push({
    "@type": pageType,
    "@id": pageId,
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: siteConfig.languageTag,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    ...(breadcrumbs.length > 0
      ? {
          breadcrumb: {
            "@id": breadcrumbId,
          },
        }
      : {}),
    ...(primaryEntity
      ? {
          mainEntity: {
            "@id": String(primaryEntity["@id"]),
          },
        }
      : {}),
  });

  if (primaryEntity) {
    graph.push(primaryEntity);
  }

  if (breadcrumbs.length > 0) {
    graph.push(buildBreadcrumbJsonLd(path, breadcrumbs));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
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
    areaServed: { "@type": "Country", name: "Germany" },
    availableLanguage: [siteConfig.languageTag],
    ...(audience
      ? {
          audience: {
            "@type": "Audience",
            audienceType: audience,
          },
        }
      : {}),
    ...(offers ? { offers } : {}),
  };
}

type OfferInput = {
  name: string;
  description: string;
  minPrice?: number;
  priceCurrency?: string;
  priceNote?: string;
};

export function buildOfferJsonLd(offers: OfferInput[]) {
  return offers.map((offer) => ({
    "@type": "Offer",
    name: offer.name,
    description: offer.description,
    ...(offer.minPrice != null
      ? {
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            minPrice: offer.minPrice,
            priceCurrency: offer.priceCurrency ?? "EUR",
          },
        }
      : {}),
    ...(offer.priceNote ? { disambiguatingDescription: offer.priceNote } : {}),
  }));
}

export function buildBreadcrumbs(currentPageName: string, currentPath: string) {
  return [
    { name: "Startseite", path: "/" },
    { name: currentPageName, path: currentPath },
  ];
}

export function serializeJsonLd(jsonLd: Record<string, unknown>) {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}

function buildBreadcrumbJsonLd(path: string, breadcrumbs: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": absoluteUrl(`${path}#breadcrumb`),
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: breadcrumb.name,
      item: absoluteUrl(breadcrumb.path),
    })),
  };
}
