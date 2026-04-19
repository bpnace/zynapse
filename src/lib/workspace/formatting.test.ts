import { describe, expect, it } from "vitest";
import {
  formatWorkspaceAssetType,
  formatWorkspaceLabel,
  formatWorkspaceRole,
} from "@/lib/workspace/formatting";

describe("workspace formatting helpers", () => {
  it("translates workflow and review labels to German", () => {
    expect(formatWorkspaceLabel("in_review")).toBe("In Prüfung");
    expect(formatWorkspaceLabel("changes_requested")).toBe("Änderungen angefordert");
    expect(formatWorkspaceLabel("approval_note")).toBe("Freigabehinweis");
    expect(formatWorkspaceLabel("growth")).toBe("Wachstum");
    expect(formatWorkspaceLabel("starter")).toBe("Starter");
  });

  it("translates asset types and roles consistently", () => {
    expect(formatWorkspaceAssetType("short_video")).toBe("Kurzvideo");
    expect(formatWorkspaceAssetType("static")).toBe("Statisches Motiv");
    expect(formatWorkspaceRole("brand_admin")).toBe("Brand-Admin");
    expect(formatWorkspaceRole("zynapse_ops")).toBe("Zynapse Service Team");
  });
});
