import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { siteConfig } from "@/lib/seo";

describe("robots route", () => {
  it("allows crawling and exposes host plus sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      host: new URL(siteConfig.url).host,
      sitemap: `${siteConfig.url}/sitemap.xml`,
    });
  });
});
