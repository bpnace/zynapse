import { describe, expect, it } from "vitest";
import { creativeSubmissionSchema } from "@/lib/validation/creative-workspace";

describe("creativeSubmissionSchema", () => {
  it("accepts a valid creative version submission payload", () => {
    const parsed = creativeSubmissionSchema.safeParse({
      campaignId: "11111111-1111-4111-8111-111111111111",
      assetId: "22222222-2222-4222-8222-222222222222",
      assignmentId: "33333333-3333-4333-8333-333333333333",
      taskId: "44444444-4444-4444-8444-444444444444",
      versionLabel: "Hook refinement v2",
      storagePath: "https://example.com/assets/hook-v2.mp4",
      thumbnailPath: "https://example.com/assets/hook-v2.jpg",
      notes: "Tightened the CTA framing and shortened the end card.",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid identifiers or empty submission details", () => {
    const parsed = creativeSubmissionSchema.safeParse({
      campaignId: "campaign-1",
      assetId: "asset-1",
      assignmentId: "assignment-1",
      versionLabel: " ",
      storagePath: "x",
    });

    expect(parsed.success).toBe(false);
  });
});
