import { describe, expect, it } from "vitest";
import {
  mapAssetVersion,
  mapCampaignAssignment,
  mapCreativeProfile,
  mapCreativeTask,
  mapRevisionItem,
} from "@/lib/workspace/data/service-role";

describe("phase 2 creative service-role mappers", () => {
  it("maps creative profiles with lifecycle metadata", () => {
    const mapped = mapCreativeProfile({
      user_id: "user-1",
      slug: "alex-motion",
      display_name: "Alex Motion",
      headline: "UGC editor",
      bio: "Cuts performant paid social edits.",
      portfolio_url: "https://portfolio.test/alex",
      specialties_json: JSON.stringify(["UGC", "editing"]),
      tools_json: JSON.stringify(["Premiere", "CapCut"]),
      industry_fit_json: JSON.stringify(["beauty", "wellness"]),
      availability_status: "limited",
      capacity_notes: "Two launches left this month",
      hourly_rate: 8500,
      day_rate: 60000,
      package_rate: 180000,
      quality_score: 92,
      created_at: "2026-04-19T09:00:00.000Z",
      updated_at: "2026-04-19T11:15:00.000Z",
    });

    expect(mapped).toMatchObject({
      userId: "user-1",
      slug: "alex-motion",
      availabilityStatus: "limited",
      qualityScore: 92,
    });
    expect(mapped.createdAt.toISOString()).toBe("2026-04-19T09:00:00.000Z");
    expect(mapped.updatedAt.toISOString()).toBe("2026-04-19T11:15:00.000Z");
  });

  it("maps assignments, tasks, versions, and revisions with nullable dates", () => {
    const assignment = mapCampaignAssignment({
      id: "assignment-1",
      campaign_id: "campaign-1",
      user_id: "user-1",
      assignment_role: "video_editor",
      status: "active",
      assigned_by: "ops-user",
      invited_at: "2026-04-19T10:00:00.000Z",
      accepted_at: "2026-04-19T10:30:00.000Z",
      due_at: null,
      scope_summary: "Own hook variants and final exports",
      created_at: "2026-04-19T10:00:00.000Z",
    });

    const task = mapCreativeTask({
      id: "task-1",
      campaign_id: "campaign-1",
      assignment_id: "assignment-1",
      task_type: "edit",
      title: "Cut founder testimonial variants",
      description: "Prepare 3 short paid-social cuts",
      status: "in_progress",
      priority: "high",
      owner_user_id: "user-1",
      created_by: "ops-user",
      blocked_reason: null,
      due_at: "2026-04-21T12:00:00.000Z",
      completed_at: null,
      created_at: "2026-04-19T10:05:00.000Z",
    });

    const version = mapAssetVersion({
      id: "version-1",
      asset_id: "asset-1",
      campaign_id: "campaign-1",
      created_by: "user-1",
      version_label: "v2",
      storage_path: "campaigns/campaign-1/v2.mp4",
      thumbnail_path: "campaigns/campaign-1/v2.jpg",
      submission_status: "submitted",
      submission_notes: "Updated CTA end card",
      created_at: "2026-04-19T12:15:00.000Z",
    });

    const revision = mapRevisionItem({
      id: "revision-1",
      campaign_id: "campaign-1",
      asset_id: "asset-1",
      task_id: "task-1",
      source_role: "brand",
      source_type: "change_request",
      category: "hook",
      priority: "urgent",
      body: "Lead with the founder close-up in the first second.",
      status: "open",
      due_at: null,
      resolved_at: null,
      resolved_by: null,
    });

    expect(assignment.acceptedAt?.toISOString()).toBe("2026-04-19T10:30:00.000Z");
    expect(assignment.dueAt).toBeNull();
    expect(task.dueAt?.toISOString()).toBe("2026-04-21T12:00:00.000Z");
    expect(task.completedAt).toBeNull();
    expect(version).toMatchObject({
      versionLabel: "v2",
      submissionStatus: "submitted",
    });
    expect(revision).toMatchObject({
      sourceRole: "brand",
      status: "open",
      priority: "urgent",
    });
  });
});
