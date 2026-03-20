import { buildSitemapXml } from "@/lib/sitemap";

const CACHE_CONTROL = "public, max-age=0, s-maxage=86400";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return new Response(buildSitemapXml(), {
    headers: {
      "Cache-Control": CACHE_CONTROL,
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
