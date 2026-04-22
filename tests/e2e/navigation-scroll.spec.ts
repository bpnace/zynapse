import { expect, test } from "@playwright/test";

const navLinks = [
  { label: "Zynapse", path: "/" },
  { label: "Für Marketing Teams", path: "/brands" },
  { label: "Beispiele", path: "/#beispiele" },
  { label: "Preise", path: "/pricing" },
  { label: "Für Kreative", path: "/creatives" },
  { label: "Kontakt", path: "/contact" },
] as const;

const mainPages = ["/", "/brands", "/creatives", "/about", "/pricing", "/contact"] as const;

test("homepage output preview renders six looping videos", async ({ page }) => {
  await page.goto("/");

  const videos = page.locator('video[src^="/videos/"]');
  await expect(videos).toHaveCount(6);

  const configs = await videos.evaluateAll((elements) =>
    elements.map((element) => {
      const video = element as HTMLVideoElement;
      return {
        src: video.getAttribute("src"),
        autoplay: video.autoplay,
        muted: video.muted,
        loop: video.loop,
        playsInline: video.playsInline,
        preload: video.preload,
        controls: video.controls,
      };
    }),
  );

  const expectedSources = [
    "/videos/11.mp4",
    "/videos/22.mp4",
    "/videos/33.mp4",
    "/videos/44.mp4",
    "/videos/55.mp4",
    "/videos/66.mp4",
  ];

  expect(configs.map((config) => config.src)).toEqual(expectedSources);

  for (const config of configs) {
    expect(config.autoplay).toBe(true);
    expect(config.muted).toBe(true);
    expect(config.loop).toBe(true);
    expect(config.playsInline).toBe(true);
    expect(config.preload).toBe("metadata");
    expect(config.controls).toBe(false);
  }
});

test("navbar navigation resets to top and stays free of known scroll errors", async ({
  page,
}) => {
  test.setTimeout(120000);

  const consoleMessages: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    consoleMessages.push(message.text());
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  for (const sourcePath of mainPages) {
    for (const link of navLinks) {
      if (sourcePath === link.path) {
        continue;
      }

      await page.goto(sourcePath);
      await page.evaluate(() => {
        window.scrollTo(0, Math.max(0, document.body.scrollHeight - window.innerHeight));
      });
      await page.waitForTimeout(120);

      const header = page.locator("header").first();
      const navTarget = header.locator(`a[href='${link.path}']`).first();

      await expect(navTarget).toBeVisible();
      await navTarget.click();

      await expect(page).toHaveURL(
        link.path === "/#beispiele"
          ? /\/(#beispiele)?$/
          : new RegExp(`${link.path === "/" ? "/$" : `${link.path}$`}`),
      );
      if (link.path !== "/#beispiele") {
        await expect
          .poll(async () => page.evaluate(() => window.scrollY), {
            timeout: 5000,
          })
          .toBeLessThan(2);
      }
    }
  }

  const knownWarnings = consoleMessages.filter((entry) =>
    entry.includes("missing-data-scroll-behavior"),
  );
  const knownScrollErrors = [
    ...consoleMessages.filter((entry) =>
      entry.includes("Cannot read properties of undefined (reading 'end')"),
    ),
    ...pageErrors.filter((entry) =>
      entry.includes("Cannot read properties of undefined (reading 'end')"),
    ),
  ];

  expect(knownWarnings).toEqual([]);
  expect(knownScrollErrors).toEqual([]);
});
