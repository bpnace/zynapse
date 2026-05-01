import routes from "@/lib/seo-routes.json";
import type { PageSchemaType } from "@/lib/seo";
import type { MarketingFaqKey } from "@/lib/content/faq";

export type MarketingServiceRouteConfig = {
  name: string;
  serviceType: string;
  audience?: string;
};

export type MarketingRoute = {
  key: string;
  path: string;
  pageFile: string;
  title: string;
  description: string;
  schemaType: PageSchemaType;
  breadcrumbLabel?: string;
  sitemap: boolean;
  faqKey?: MarketingFaqKey;
  service?: MarketingServiceRouteConfig;
};

export const marketingRoutes = routes as readonly MarketingRoute[];

export function getMarketingRoute(path: string): MarketingRoute {
  const route = marketingRoutes.find((item) => item.path === path);

  if (!route) {
    throw new Error(`Marketing route not found for path: ${path}`);
  }

  return route;
}

export const indexableMarketingRoutes = marketingRoutes.filter(
  (route) => route.sitemap,
);
