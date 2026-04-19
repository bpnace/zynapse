import {
  assertSupabaseResult,
  mapAsset,
  mapCampaign,
  mapCampaignAssignment,
  mapComment,
  mapCreativeProfile,
  mapReviewThread,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import type { WorkspaceRole } from "@/lib/auth/roles";

function deriveCreativeIdentity(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase() ?? "creative@zynapse.eu";
  const handle = normalizedEmail.split("@")[0] ?? "creative";
  const words = handle
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return {
    slug: handle.replace(/[^a-z0-9-]/g, "-"),
    displayName: words.join(" ") || "Creative Partner",
  };
}

function mapAssignmentRole(role: WorkspaceRole) {
  if (role === "creative_lead") {
    return "creative_lead" as const;
  }

  return "creative" as const;
}

export async function bootstrapCreativeWorkspaceForUser(params: {
  organizationId: string;
  userId: string;
  userEmail?: string | null;
  role: WorkspaceRole;
}) {
  const supabase = requireServiceRoleClient();
  const identity = deriveCreativeIdentity(params.userEmail);

  const { data: creativeProfileRow, error: creativeProfileError } = await supabase
    .from("creative_profiles")
    .upsert(
      {
        user_id: params.userId,
        slug: identity.slug,
        display_name: identity.displayName,
        headline: "Curated creative execution partner",
        bio: "Focused on creative production, revisions, and delivery-readiness handoffs.",
        specialties: "Concepting, Prompting, Motion, Delivery",
        portfolio_url: null,
        availability_status: "active",
      },
      {
        onConflict: "user_id",
      },
    )
    .select("*")
    .single();

  assertSupabaseResult(creativeProfileError, "Failed to upsert creative profile");
  const creativeProfile = creativeProfileRow ? mapCreativeProfile(creativeProfileRow) : null;

  const { data: campaignRows, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", params.organizationId)
    .order("created_at", { ascending: false })
    .limit(1);

  assertSupabaseResult(campaignError, "Failed to load campaign for creative bootstrap");

  const campaign = campaignRows?.[0] ? mapCampaign(campaignRows[0]) : null;

  if (!campaign) {
    return { creativeProfile, assignment: null };
  }

  const { data: assignmentRows, error: assignmentError } = await supabase
    .from("campaign_assignments")
    .upsert(
      {
        campaign_id: campaign.id,
        user_id: params.userId,
        assignment_role: mapAssignmentRole(params.role),
        status: "in_progress",
        scope_summary:
          "Own execution quality for the current delivery sprint, keep variants organized, and respond to revision requests quickly.",
      },
      {
        onConflict: "campaign_id,user_id",
      },
    )
    .select("*");

  assertSupabaseResult(assignmentError, "Failed to upsert creative assignment");

  const assignmentRow = assignmentRows?.[0] ?? null;
  const assignment = assignmentRow ? mapCampaignAssignment(assignmentRow) : null;

  if (!assignment) {
    return { creativeProfile, assignment: null };
  }

  const { data: taskRows, error: taskError } = await supabase
    .from("creative_tasks")
    .select("*")
    .eq("assignment_id", assignment.id)
    .limit(1);

  assertSupabaseResult(taskError, "Failed to check creative tasks");

  const { data: assetRows, error: assetError } = await supabase
    .from("assets")
    .select("*")
    .eq("campaign_id", campaign.id)
    .order("created_at", { ascending: false })
    .limit(3);

  assertSupabaseResult(assetError, "Failed to load assets for creative bootstrap");

  const assets = (assetRows ?? []).map(mapAsset);

  if ((taskRows ?? []).length === 0) {
    const dueAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString();
    const seededTasks: Array<{
      campaign_id: string;
      assignment_id: string;
      asset_id: string;
      owner_user_id: string;
      title: string;
      description: string;
      task_type: CreativeTaskType;
      status: CreativeTaskStatus;
      priority: CreativeTaskPriority;
      due_at: string;
    }> = assets.slice(0, 2).map((asset, index) => ({
      campaign_id: campaign.id,
      assignment_id: assignment.id,
      asset_id: asset.id,
      owner_user_id: params.userId,
      title: `${index === 0 ? "Refine" : "Package"} ${asset.title}`,
      description:
        index === 0
          ? "Tighten the current hook, CTA framing, and export notes so the next review lands cleanly."
          : "Prepare the approved cut with clean naming, thumbnail coverage, and handoff-ready notes.",
      task_type: index === 0 ? "revision" : "delivery",
      status: index === 0 ? "in_progress" : "todo",
      priority: index === 0 ? "high" : "medium",
      due_at: dueAt,
    }));

    if (seededTasks.length > 0) {
      const { error: taskInsertError } = await supabase
        .from("creative_tasks")
        .insert(seededTasks);

      assertSupabaseResult(taskInsertError, "Failed to seed creative tasks");
    }
  }

  const { data: revisionRows, error: revisionError } = await supabase
    .from("revision_items")
    .select("*")
    .eq("assignment_id", assignment.id)
    .limit(1);

  assertSupabaseResult(revisionError, "Failed to check revision items");

  if ((revisionRows ?? []).length === 0 && assets.length > 0) {
    const assetIds = assets.map((asset) => asset.id);
    const [{ data: reviewThreadRows, error: reviewThreadError }, { data: commentRows, error: commentError }] =
      await Promise.all([
        supabase.from("review_threads").select("*").in("asset_id", assetIds),
        supabase.from("comments").select("*"),
      ]);

    assertSupabaseResult(reviewThreadError, "Failed to load review threads for creative bootstrap");
    assertSupabaseResult(commentError, "Failed to load comments for creative bootstrap");

    const reviewThreads = (reviewThreadRows ?? []).map(mapReviewThread);
    const comments = (commentRows ?? []).map(mapComment);

    const revisions: Array<{
      campaign_id: string;
      assignment_id: string;
      asset_id: string;
      review_thread_id: string;
      source_comment_id: string;
      created_by: string;
      title: string;
      detail: string;
      status: RevisionItemStatus;
      priority: CreativeTaskPriority;
    }> = reviewThreads.flatMap((thread) => {
      const asset = assets.find((candidate) => candidate.id === thread.assetId);
      if (!asset) {
        return [];
      }

      const matchingComment = comments.find(
        (comment) =>
          comment.threadId === thread.id &&
          (comment.commentType === "change_request" || comment.commentType === "comment"),
      );

      if (!matchingComment) {
        return [];
      }

      return [
        {
          campaign_id: campaign.id,
          assignment_id: assignment.id,
          asset_id: asset.id,
          review_thread_id: thread.id,
          source_comment_id: matchingComment.id,
          created_by: matchingComment.authorId,
          title: `Resolve feedback for ${asset.title}`,
          detail: matchingComment.body,
          status: "open",
          priority: matchingComment.commentType === "change_request" ? "high" : "medium",
        },
      ];
    });

    if (revisions.length > 0) {
      const { error: revisionInsertError } = await supabase
        .from("revision_items")
        .insert(revisions);

      assertSupabaseResult(revisionInsertError, "Failed to seed revision items");
    }
  }

  return {
    creativeProfile,
    assignment,
  };
}
import type {
  CreativeTaskPriority,
  CreativeTaskStatus,
  CreativeTaskType,
  RevisionItemStatus,
} from "@/lib/workspace/data/types";
