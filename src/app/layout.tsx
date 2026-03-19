import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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
      <body className="antialiased">
        <JsonLdScript data={siteJsonLd} />
        <RouteScrollReset />
        <div className="relative">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        <SiteAnalytics />
      </body>
    </html>
  );
}
