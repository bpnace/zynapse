import { describe, expect, it } from "vitest";
import { decorateWorkspaceAssetMedia, resolveWorkspaceAssetMedia } from "@/lib/workspace/media";

describe("workspace media resolution", () => {
  it("resolves demo public video assets into preview and poster URLs", () => {
    expect(
      resolveWorkspaceAssetMedia({
        assetType: "short_video",
        title: "Proof Cut",
        storagePath: "/videos/33.mp4",
        thumbnailPath: "/hero/Cua0pUQRm.png",
        source: "demo_public",
      }),
    ).toEqual({
      previewUrl: "/videos/33.mp4",
      posterUrl: "/hero/Cua0pUQRm.png",
      mediaSource: "demo_public",
      isVideo: true,
      isPlaceholder: false,
      hasRenderableMedia: true,
    });
  });

  it("resolves placeholder image assets without relying on path prefixes", () => {
    expect(
      resolveWorkspaceAssetMedia({
        assetType: "static",
        title: "Founder Card",
        storagePath: "/brand/peep-standing-16.png",
        thumbnailPath: null,
        source: "demo_placeholder",
      }),
    ).toEqual({
      previewUrl: "/brand/peep-standing-16.png",
      posterUrl: "/brand/peep-standing-16.png",
      mediaSource: "demo_placeholder",
      isVideo: false,
      isPlaceholder: true,
      hasRenderableMedia: true,
    });
  });

  it("falls back safely when asset paths are opaque", () => {
    expect(
      decorateWorkspaceAssetMedia({
        assetType: "short_video",
        title: "Legacy Asset",
        storagePath: "demo-assets/legacy.mp4",
        thumbnailPath: "demo-assets/legacy.jpg",
        source: "seed",
      }),
    ).toMatchObject({
      previewUrl: null,
      posterUrl: null,
      mediaSource: "unknown",
      hasRenderableMedia: false,
    });
  });
});
