import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { WorkspaceAssetPreview } from "@/components/workspace/shared/workspace-asset-preview";

afterEach(() => {
  cleanup();
});

describe("WorkspaceAssetPreview", () => {
  it("renders a video element for video assets with preview URLs", () => {
    render(
      <WorkspaceAssetPreview
        data-testid="preview"
        assetType="short_video"
        title="Proof Cut"
        previewUrl="/videos/33.mp4"
        posterUrl="/hero/Cua0pUQRm.png"
      />,
    );

    const preview = screen.getByTestId("preview");

    expect(preview.tagName).toBe("VIDEO");
    expect(preview).toHaveAttribute("src", "/videos/33.mp4");
    expect(preview).toHaveAttribute("poster", "/hero/Cua0pUQRm.png");
  });

  it("renders an image element for static assets", () => {
    render(
      <WorkspaceAssetPreview
        data-testid="preview"
        assetType="static"
        title="Founder Card"
        previewUrl="/brand/peep-standing-16.png"
        posterUrl="/brand/peep-standing-16.png"
      />,
    );

    const preview = screen.getByTestId("preview");

    expect(preview.tagName).toBe("IMG");
    expect(preview).toHaveAttribute("src", "/brand/peep-standing-16.png");
  });

  it("renders a fallback when no renderable media exists", () => {
    render(
      <WorkspaceAssetPreview
        data-testid="preview"
        assetType="short_video"
        title="Fallback Asset"
        previewUrl={null}
        posterUrl={null}
      />,
    );

    expect(screen.getByTestId("preview")).toHaveTextContent(/vorschau folgt/i);
  });
});
