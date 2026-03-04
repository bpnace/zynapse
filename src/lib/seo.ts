import type { Metadata } from "next";

const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zynapse.example";

export const siteConfig = {
  name: "Zynapse",
  description:
    "Zynapse verwandelt ein Brand-Briefing in eine fertige Videokampagne – mit klarer, manager-geführter Kampagnenlogik und skalierbarem Studio-Output.",
  url: defaultSiteUrl,
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({
  title,
  description,
  path,
}: MetadataInput): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: "de_DE",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
