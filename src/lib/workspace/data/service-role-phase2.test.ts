import { describe, expect, it } from "vitest";
import {
  mapAssetVersion,
  mapCampaignAssignment,
  mapCreativeProfile,
  mapCreativeTask,
  mapRevisionItem,
} from "@/lib/workspace/data/service-role";

describe("phase 2 creative service-role mappers", () => {
  it("maps creative profiles with the curated execution fields", () => {
    const mapped = mapCreativeProfile({
      id: "profile-1",
      user_id: "user-1",
      slug: "alex-motion",
      display_name: "Alex Motion",
      headline: "UGC editor",
      bio: "Cuts performant paid social edits.",
      specialties: "UGC, editing",
      portfolio_url: "https://portfolio.test/alex",
      availability_status: "limited",
      created_at: "2026-04-19T09:00:00.000Z",
    });

    expect(mapped).toMatchObject({
      id: "profile-1",
      userId: "user-1",
      slug: "alex-motion",
      availabilityStatus: "limited",
    });
    expect(mapped.createdAt.toISOString()).toBe("2026-04-19T09:00:00.000Z");
  });

  it("maps assignments, tasks, versions, and revisions with nullable dates", () => {
    const assignment = mapCampaignAssignment({
      id: "assignment-1",
      campaign_id: "campaign-1",
      user_id: "user-1",
      assignment_role: "creative",
      status: "in_progress",
      assigned_by: "ops-user",
      scope_summary: "Own hook variants and final exports",
      due_at: null,
      accepted_at: "2026-04-19T10:30:00.000Z",
      submitted_at: null,
      created_at: "2026-04-19T10:00:00.000Z",
    });

    const task = mapCreativeTask({
      id: "task-1",
      campaign_id: "campaign-1",
      assignment_id: "assignment-1",
      asset_id: "asset-1",
      owner_user_id: "user-1",
      title: "Cut founder testimonial variants",
      description: "Prepare 3 short paid-social cuts",
      task_type: "production",
      status: "in_progress",
      priority: "high",
      blocked_reason: null,
      due_at: "2026-04-21T12:00:00.000Z",
      submitted_at: null,
      completed_at: null,
      created_at: "2026-04-19T10:05:00.000Z",
    });

    const version = mapAssetVersion({
      id: "version-1",
      asset_id: "asset-1",
      campaign_id: "campaign-1",
      assignment_id: "assignment-1",
      created_by: "user-1",
      version_label: "v2",
      storage_path: "https://example.com/campaigns/campaign-1/v2.mp4",
      thumbnail_path: "https://example.com/campaigns/campaign-1/v2.jpg",
      notes: "Updated CTA end card",
      submission_status: "submitted_for_ops_review",
      created_at: "2026-04-19T12:15:00.000Z",
    });

    const revision = mapRevisionItem({
      id: "revision-1",
      campaign_id: "campaign-1",
      assignment_id: "assignment-1",
      asset_id: "asset-1",
      review_thread_id: "thread-1",
      source_comment_id: "comment-1",
      created_by: "brand_admin",
      title: "Lead with the founder close-up",
      detail: "Lead with the founder close-up in the first second.",
      status: "open",
      priority: "high",
      created_at: "2026-04-19T12:20:00.000Z",
      resolved_at: null,
    });

    expect(assignment.acceptedAt?.toISOString()).toBe("2026-04-19T10:30:00.000Z");
    expect(assignment.dueAt).toBeNull();
    expect(task.dueAt?.toISOString()).toBe("2026-04-21T12:00:00.000Z");
    expect(task.completedAt).toBeNull();
    expect(version).toMatchObject({
      versionLabel: "v2",
      submissionStatus: "submitted_for_ops_review",
    });
    expect(revision).toMatchObject({
      title: "Lead with the founder close-up",
      status: "open",
      priority: "high",
    });
  });
});
