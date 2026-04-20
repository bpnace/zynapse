import {
  assertSupabaseResult,
  mapCampaign,
  mapCampaignAssignment,
  mapCampaignWorkflow,
  mapCreativeProfile,
  mapCreativeTask,
  mapMembership,
  mapRevisionItem,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";

function toIsoString(value: Date | null) {
  return value ? value.toISOString() : null;
}

function deriveCurrentStage({
  workflowStatus,
  reviewStatus,
  deliveryStatus,
}: {
  workflowStatus: string;
  reviewStatus: string;
  deliveryStatus: string;
}) {
  if (deliveryStatus === "ready" || workflowStatus === "complete") {
    return "handover_ready";
  }

  if (reviewStatus === "approved" || workflowStatus === "handover") {
    return "approved";
  }

  if (reviewStatus === "in_review" || workflowStatus === "review") {
    return "in_review";
  }

  if (workflowStatus === "production") {
    return "production_ready";
  }

  return "setup_planned";
}

export async function getOpsDashboardView(organizationId: string) {
  const supabase = requireServiceRoleClient();

  const { data: campaignRows, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  assertSupabaseResult(campaignError, "Failed to load ops campaigns");

  const campaigns = (campaignRows ?? []).map(mapCampaign);
  const campaignIds = campaigns.map((campaign) => campaign.id);

  const [
    workflowRowsResult,
    assignmentRowsResult,
    taskRowsResult,
    revisionRowsResult,
    assetRowsResult,
    membershipRowsResult,
  ] = await Promise.all([
    campaignIds.length > 0
      ? supabase
          .from("campaign_workflows")
          .select("*")
          .in("campaign_id", campaignIds)
      : supabase.from("campaign_workflows").select("*").limit(0),
    campaignIds.length > 0
      ? supabase
          .from("campaign_assignments")
          .select("*")
          .in("campaign_id", campaignIds)
      : supabase.from("campaign_assignments").select("*").limit(0),
    campaignIds.length > 0
      ? supabase.from("creative_tasks").select("*").in("campaign_id", campaignIds)
      : supabase.from("creative_tasks").select("*").limit(0),
    campaignIds.length > 0
      ? supabase.from("revision_items").select("*").in("campaign_id", campaignIds)
      : supabase.from("revision_items").select("*").limit(0),
    campaignIds.length > 0
      ? supabase
          .from("assets")
          .select("id,campaign_id,review_status")
          .in("campaign_id", campaignIds)
      : supabase.from("assets").select("id,campaign_id,review_status").limit(0),
    supabase
      .from("memberships")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("workspace_type", "creative"),
  ]);

  assertSupabaseResult(workflowRowsResult.error, "Failed to load ops workflows");
  assertSupabaseResult(assignmentRowsResult.error, "Failed to load ops assignments");
  assertSupabaseResult(taskRowsResult.error, "Failed to load ops tasks");
  assertSupabaseResult(revisionRowsResult.error, "Failed to load ops revisions");
  assertSupabaseResult(assetRowsResult.error, "Failed to load ops asset statuses");
  assertSupabaseResult(membershipRowsResult.error, "Failed to load creative memberships");

  const workflows = (workflowRowsResult.data ?? []).map(mapCampaignWorkflow);
  const assignments = (assignmentRowsResult.data ?? []).map(mapCampaignAssignment);
  const tasks = (taskRowsResult.data ?? []).map(mapCreativeTask);
  const revisions = (revisionRowsResult.data ?? []).map(mapRevisionItem);
  const creativeMemberships = (membershipRowsResult.data ?? []).map(mapMembership);
  const creativeUserIds = Array.from(new Set(creativeMemberships.map((membership) => membership.userId)));

  const { data: creativeProfileRows, error: creativeProfileError } =
    creativeUserIds.length > 0
      ? await supabase
          .from("creative_profiles")
          .select("*")
          .in("user_id", creativeUserIds)
      : { data: [], error: null };

  assertSupabaseResult(creativeProfileError, "Failed to load creative profiles");

  const creativeProfiles = (creativeProfileRows ?? []).map(mapCreativeProfile);
  const profileByUserId = new Map(creativeProfiles.map((profile) => [profile.userId, profile]));
  const workflowByCampaignId = new Map(workflows.map((workflow) => [workflow.campaignId, workflow]));
  const assignmentsByCampaignId = new Map<string, typeof assignments>();
  const tasksByCampaignId = new Map<string, typeof tasks>();
  const revisionsByCampaignId = new Map<string, typeof revisions>();
  const approvedAssetsByCampaignId = new Map<string, number>();

  for (const assignment of assignments) {
    const bucket = assignmentsByCampaignId.get(assignment.campaignId) ?? [];
    bucket.push(assignment);
    assignmentsByCampaignId.set(assignment.campaignId, bucket);
  }

  for (const task of tasks) {
    const bucket = tasksByCampaignId.get(task.campaignId) ?? [];
    bucket.push(task);
    tasksByCampaignId.set(task.campaignId, bucket);
  }

  for (const revision of revisions) {
    const bucket = revisionsByCampaignId.get(revision.campaignId) ?? [];
    bucket.push(revision);
    revisionsByCampaignId.set(revision.campaignId, bucket);
  }

  for (const asset of assetRowsResult.data ?? []) {
    if (asset.review_status !== "approved") {
      continue;
    }

    approvedAssetsByCampaignId.set(
      asset.campaign_id,
      (approvedAssetsByCampaignId.get(asset.campaign_id) ?? 0) + 1,
    );
  }

  const campaignItems = campaigns.map((campaign) => {
    const workflow = workflowByCampaignId.get(campaign.id) ?? null;
    const campaignAssignments = assignmentsByCampaignId.get(campaign.id) ?? [];
    const campaignTasks = tasksByCampaignId.get(campaign.id) ?? [];
    const campaignRevisions = revisionsByCampaignId.get(campaign.id) ?? [];
    const currentStage =
      workflow === null
        ? campaign.currentStage
        : deriveCurrentStage({
            workflowStatus: workflow.workflowStatus,
            reviewStatus: workflow.reviewStatus,
            deliveryStatus: workflow.deliveryStatus,
          });

    return {
      id: campaign.id,
      name: campaign.name,
      packageTier: campaign.packageTier,
      currentStage,
      workflow: workflow
        ? {
            workflowStatus: workflow.workflowStatus,
            reviewStatus: workflow.reviewStatus,
            deliveryStatus: workflow.deliveryStatus,
            commercialStatus: workflow.commercialStatus,
            blockedReason: workflow.blockedReason,
            lastTransitionAt: workflow.lastTransitionAt.toISOString(),
          }
        : null,
      assignments: campaignAssignments.map((assignment) => {
        const profile = profileByUserId.get(assignment.userId);

        return {
          id: assignment.id,
          userId: assignment.userId,
          assignmentRole: assignment.assignmentRole,
          status: assignment.status,
          scopeSummary: assignment.scopeSummary,
          dueAt: toIsoString(assignment.dueAt),
          acceptedAt: toIsoString(assignment.acceptedAt),
          submittedAt: toIsoString(assignment.submittedAt),
          displayName: profile?.displayName ?? "Creative Partner",
          headline: profile?.headline ?? null,
        };
      }),
      activeTaskCount: campaignTasks.filter((task) =>
        ["todo", "in_progress", "blocked"].includes(task.status),
      ).length,
      submittedTaskCount: campaignTasks.filter((task) => task.status === "submitted").length,
      openRevisionCount: campaignRevisions.filter((revision) => revision.status !== "resolved").length,
      approvedAssetCount: approvedAssetsByCampaignId.get(campaign.id) ?? 0,
    };
  });

  const now = Date.now();
  const summary = {
    campaignCount: campaignItems.length,
    reviewReadyCount: campaignItems.filter(
      (campaign) => campaign.workflow?.reviewStatus === "in_review",
    ).length,
    deliveryReadyCount: campaignItems.filter(
      (campaign) => campaign.workflow?.deliveryStatus === "ready",
    ).length,
    commercialReadyCount: campaignItems.filter((campaign) =>
      ["ready_for_pilot", "pilot_requested"].includes(
        campaign.workflow?.commercialStatus ?? "",
      ),
    ).length,
    blockedCampaignCount: campaignItems.filter(
      (campaign) => Boolean(campaign.workflow?.blockedReason),
    ).length,
    activeAssignmentCount: assignments.filter((assignment) =>
      ["assigned", "accepted", "in_progress", "blocked"].includes(assignment.status),
    ).length,
    overdueAssignmentCount: assignments.filter((assignment) => {
      if (!assignment.dueAt) {
        return false;
      }

      return (
        assignment.dueAt.getTime() < now &&
        !["submitted", "completed"].includes(assignment.status)
      );
    }).length,
    openRevisionCount: revisions.filter((revision) => revision.status !== "resolved").length,
  };

  const auditEvents = [
    ...workflows.map((workflow) => ({
      id: `workflow-${workflow.id}`,
      campaignName:
        campaigns.find((campaign) => campaign.id === workflow.campaignId)?.name ??
        "Campaign",
      label: "Workflow updated",
      detail: `${workflow.workflowStatus} · review ${workflow.reviewStatus} · delivery ${workflow.deliveryStatus}`,
      occurredAt: workflow.lastTransitionAt.toISOString(),
    })),
    ...assignments
      .filter((assignment) => assignment.submittedAt || assignment.acceptedAt)
      .map((assignment) => {
        const profile = profileByUserId.get(assignment.userId);

        return {
          id: `assignment-${assignment.id}`,
          campaignName:
            campaigns.find((campaign) => campaign.id === assignment.campaignId)?.name ??
            "Campaign",
          label: assignment.submittedAt ? "Creative submitted work" : "Assignment accepted",
          detail: `${profile?.displayName ?? "Creative Partner"} · ${assignment.assignmentRole}`,
          occurredAt: (assignment.submittedAt ?? assignment.acceptedAt ?? assignment.createdAt).toISOString(),
        };
      }),
    ...revisions.map((revision) => ({
      id: `revision-${revision.id}`,
      campaignName:
        campaigns.find((campaign) => campaign.id === revision.campaignId)?.name ??
        "Campaign",
      label: revision.status === "resolved" ? "Revision resolved" : "Revision opened",
      detail: revision.title,
      occurredAt: (revision.resolvedAt ?? revision.createdAt).toISOString(),
    })),
  ]
    .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
    .slice(0, 10);

  return {
    summary,
    availableCreatives: creativeMemberships.map((membership) => {
      const profile = profileByUserId.get(membership.userId);

      return {
        userId: membership.userId,
        displayName: profile?.displayName ?? membership.userId,
        headline: profile?.headline ?? null,
        role: membership.role,
        membershipStatus: membership.membershipStatus,
      };
    }),
    campaigns: campaignItems,
    auditEvents,
  };
}
