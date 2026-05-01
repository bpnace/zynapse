import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { siteConfig } from "@/lib/seo";

describe("robots route", () => {
  it("allows crawling and exposes the canonical sitemap", () => {
    expect(robots()).toEqual({
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: "/api/",
        },
        {
          userAgent: "OAI-SearchBot",
          allow: "/",
        },
        {
          userAgent: "ChatGPT-User",
          allow: "/",
        },
        {
          userAgent: "Claude-SearchBot",
          allow: "/",
        },
        {
          userAgent: "Claude-User",
          allow: "/",
        },
        {
          userAgent: "PerplexityBot",
          allow: "/",
        },
        {
          userAgent: "Applebot-Extended",
          allow: "/",
        },
        {
          userAgent: "GPTBot",
          allow: "/",
        },
        {
          userAgent: "ClaudeBot",
          allow: "/",
        },
        {
          userAgent: "Google-Extended",
          allow: "/",
        },
      ],
      sitemap: `${siteConfig.url}/sitemap.xml`,
    });
  });
});
