import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { SiteAnalytics } from "@/components/layout/site-analytics";
import { RouteScrollReset } from "@/components/layout/route-scroll-reset";
import { JsonLdScript } from "@/components/seo/json-ld";
import { buildRootJsonLd, buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteJsonLd = buildRootJsonLd();

  return (
    <html lang="de" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <Script
          src="https://cloud.ccm19.de/app.js?apiKey=507d502de0eb3f51b6e05274ca2398f5e01f425482111733&domain=69c1143c6b7facd13b028a22"
          strategy="beforeInteractive"
          referrerPolicy="origin"
        />
      </head>
      <body className="antialiased">
        <JsonLdScript data={siteJsonLd} />
        <RouteScrollReset />
        <AppShell>{children}</AppShell>
        <SiteAnalytics />
      </body>
    </html>
  );
}
