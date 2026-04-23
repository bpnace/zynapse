import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { SiteAnalytics } from "@/components/layout/site-analytics";
import { RouteScrollReset } from "@/components/layout/route-scroll-reset";
import { JsonLdScript } from "@/components/seo/json-ld";
import { getEnv } from "@/lib/env";
import { buildRootJsonLd, buildSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteJsonLd = buildRootJsonLd();
  const { analyticsId } = getEnv();

  return (
    <html lang="de" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <Script
          src="https://cloud.ccm19.de/app.js?apiKey=d592996048b9c1ae961182587a25572046e9d8439d2b26cb&domain=69e4d88aec1e79c0e70e9662"
          strategy="beforeInteractive"
          referrerPolicy="origin"
        />
      </head>
      <body className="antialiased">
        <JsonLdScript data={siteJsonLd} />
        <RouteScrollReset />
        <AppShell>{children}</AppShell>
        <SiteAnalytics analyticsId={analyticsId} />
      </body>
    </html>
  );
}
