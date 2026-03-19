import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  buildBreadcrumbs,
  buildMetadata,
  buildPageJsonLd,
  buildServiceJsonLd,
  siteConfig,
} from "@/lib/seo";

describe("buildMetadata", () => {
  it("builds indexable metadata with canonical, locale, and preview directives", () => {
    const metadata = buildMetadata({
      title: "Startseite | Zynapse",
      description: "Kuratiertes AI-Kampagnensystem für Brands.",
      path: "/",
    });

    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.openGraph).toMatchObject({
      title: "Startseite | Zynapse",
      description: "Kuratiertes AI-Kampagnensystem für Brands.",
      url: absoluteUrl("/"),
      locale: siteConfig.locale,
      siteName: siteConfig.name,
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Startseite | Zynapse",
      description: "Kuratiertes AI-Kampagnensystem für Brands.",
    });
    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    });
  });

  it("builds noindex metadata for non-ranking routes", () => {
    const metadata = buildMetadata({
      title: "Brand-Anfrage | Zynapse",
      description: "Geführte Brand-Anfrage.",
      path: "/request",
      indexable: false,
    });

    expect(metadata.alternates?.canonical).toBe("/request");
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    });
  });
});

describe("buildPageJsonLd", () => {
  it("connects page, service, and breadcrumbs in one graph", () => {
    const service = buildServiceJsonLd({
      path: "/brands",
      name: "AI-Kampagnen-Setups für Brands",
      description: "Kuratiertes Setup für Brands.",
      serviceType: "Kuratiertes AI-Kampagnensystem für Brands",
      audience: "Brand- und Performance-Teams",
    });
    const jsonLd = buildPageJsonLd({
      title: "Für Brands | Zynapse",
      description: "Kuratiertes Setup für Brands.",
      path: "/brands",
      breadcrumbs: buildBreadcrumbs("Für Brands", "/brands"),
      primaryEntity: service,
    });
    const graph = jsonLd["@graph"] as Array<Record<string, unknown>>;

    expect(graph).toHaveLength(3);
    expect(graph[0]).toMatchObject({
      "@type": "WebPage",
      "@id": absoluteUrl("/brands#webpage"),
    });
    expect(graph[1]).toMatchObject({
      "@type": "Service",
      "@id": absoluteUrl("/brands#service"),
    });
    expect(graph[2]).toMatchObject({
      "@type": "BreadcrumbList",
    });

    const breadcrumbItems = graph[2].itemListElement as Array<Record<string, unknown>>;
    expect(breadcrumbItems).toHaveLength(2);
    expect(breadcrumbItems[0]).toMatchObject({
      position: 1,
      name: "Startseite",
      item: absoluteUrl("/"),
    });
    expect(breadcrumbItems[1]).toMatchObject({
      position: 2,
      name: "Für Brands",
      item: absoluteUrl("/brands"),
    });
  });
});
