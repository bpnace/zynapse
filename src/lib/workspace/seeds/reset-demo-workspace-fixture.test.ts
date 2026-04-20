import { describe, expect, it } from "vitest";
import { buildDemoWorkspaceParticipants } from "../../../../scripts/reset-demo-workspace.fixture.mjs";

describe("buildDemoWorkspaceParticipants", () => {
  it("builds the canonical brand, creative, and ops demo fixture", () => {
    const participants = buildDemoWorkspaceParticipants({
      canonicalBrandEmail: "demo@zynapse.eu",
    });

    expect(participants).toEqual([
      {
        key: "brand",
        email: "demo@zynapse.eu",
        role: "brand_reviewer",
        workspaceType: "brand",
      },
      {
        key: "creative",
        email: "demo+creative@zynapse.eu",
        role: "creative_lead",
        workspaceType: "creative",
      },
      {
        key: "ops",
        email: "demo+ops@zynapse.eu",
        role: "ops_admin",
        workspaceType: "ops",
      },
    ]);
  });

  it("preserves the canonical demo login while allowing an additional brand login alias", () => {
    const participants = buildDemoWorkspaceParticipants({
      canonicalBrandEmail: "demo@zynapse.eu",
      requestedBrandEmail: "demo+e2e@zynapse.eu",
      creativeEmail: "creative.fixture@zynapse.eu",
      opsEmail: "ops.fixture@zynapse.eu",
    });

    expect(participants).toEqual([
      {
        key: "brand",
        email: "demo@zynapse.eu",
        role: "brand_reviewer",
        workspaceType: "brand",
      },
      {
        key: "brand_login",
        email: "demo+e2e@zynapse.eu",
        role: "brand_reviewer",
        workspaceType: "brand",
      },
      {
        key: "creative",
        email: "creative.fixture@zynapse.eu",
        role: "creative_lead",
        workspaceType: "creative",
      },
      {
        key: "ops",
        email: "ops.fixture@zynapse.eu",
        role: "ops_admin",
        workspaceType: "ops",
      },
    ]);
  });

  it("deduplicates overlapping requested and canonical emails", () => {
    const participants = buildDemoWorkspaceParticipants({
      canonicalBrandEmail: "Demo@zynapse.eu",
      requestedBrandEmail: "demo@zynapse.eu",
    });

    expect(participants.map((participant) => participant.key)).toEqual([
      "brand",
      "creative",
      "ops",
    ]);
  });
});
