import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const routes = [
  "",
  "/brands",
  "/managers",
  "/about",
  "/pricing",
  "/contact",
  "/request",
  "/apply",
  "/legal/imprint",
  "/legal/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: absoluteUrl(route || "/"),
    lastModified,
  }));
}
