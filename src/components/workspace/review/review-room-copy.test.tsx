import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReviewRoom } from "@/components/workspace/review/review-room";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const campaign = {
  id: "campaign-1",
  name: "Frühlingskampagne",
  packageTier: "Starter",
  currentStage: "in_review",
};

const baseAsset = {
  id: "asset-1",
  title: "Variante 01 · Produktbeweis",
  assetType: "short_video",
  format: "9:16",
  versionLabel: "v2",
  reviewStatus: "changes_requested",
  threadCount: 1,
  latestCommentType: "change_request",
  previewUrl: null,
  posterUrl: null,
};

describe("ReviewRoom copy", () => {
  it("renders the localized discussion terminology in the review surface", () => {
    render(
      <ReviewRoom
        campaign={campaign}
        assets={[baseAsset]}
        selectedAsset={{
          ...baseAsset,
          storagePath: null,
          thumbnailPath: null,
          previewUrl: null,
          posterUrl: null,
          createdAt: new Date("2026-04-01T10:00:00Z"),
          threads: [
            {
              threadId: "thread-1",
              createdBy: "brand_admin",
              resolvedAt: null,
              anchor: null,
              comments: [
                {
                  id: "comment-1",
                  authorId: "brand_admin",
                  body: "Bitte den Einstieg schärfen.",
                  commentType: "change_request",
                  createdAt: new Date("2026-04-01T10:05:00Z"),
                },
              ],
            },
          ],
        }}
        canReview
        demo={{
          canonicalEmail: "demo@zynapse.eu",
          organizationSlug: "zynapse-closed-demo",
          loginRoute: "/demo-login",
          isEnabled: true,
          isDemoWorkspace: false,
          isReadOnly: false,
          shellBadge: "Geschlossene Demo",
          shellDescription: "Schreibgeschützte Demo-Ansicht.",
          mutationMessage: "Die Demo ist schreibgeschützt.",
        }}
      />,
    );

    expect(screen.getByText("Offene Diskussionen")).toBeInTheDocument();
    expect(screen.getByText("Kampagnenstatus")).toBeInTheDocument();
    expect(screen.getByText("Braucht Rückmeldung")).toBeInTheDocument();
    expect(screen.getByText(/Diskussion von/i)).toBeInTheDocument();
    expect(screen.getByText(/1 offene Diskussionen?, 0 gelöste Diskussionen/i)).toBeInTheDocument();
  });
});
