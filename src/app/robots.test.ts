import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { siteConfig } from "@/lib/seo";

describe("robots route", () => {
  it("allows crawling and exposes the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${siteConfig.url}/sitemap.xml`,
    });
  });
});
