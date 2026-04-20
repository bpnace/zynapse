import {
  assertSupabaseResult,
  mapAsset,
  mapAssetVersion,
  mapCampaign,
  mapCampaignAssignment,
  mapCampaignStage,
  mapCampaignWorkflow,
  mapCreativeProfile,
  mapCreativeTask,
  mapPilotRequest,
  mapRevisionItem,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { decorateWorkspaceAssetMedia } from "@/lib/workspace/media";
import { getBrandWorkspaceReadiness } from "@/lib/workspace/readiness";
import { deriveOpsAuditFeed } from "@/lib/workspace/queries/get-ops-overview";

type GetOpsCampaignDetailParams = {
  organizationId: string;
  campaignId: string;
};

export async function getOpsCampaignDetail({
  organizationId,
  campaignId,
}: GetOpsCampaignDetailParams) {
  const supabase = requireServiceRoleClient();

  const [
    { data: campaignRow, error: campaignError },
    { data: workflowRow, error: workflowError },
    { data: assignmentRows, error: assignmentError },
    { data: stageRows, error: stageError },
    { data: assetRows, error: assetError },
    { data: versionRows, error: versionError },
    { data: taskRows, error: taskError },
    { data: revisionRows, error: revisionError },
    { data: requestRows, error: requestError },
    { data: creativeProfileRows, error: creativeProfileError },
  ] = await Promise.all([
    supabase.from("campaigns").select("*").eq("id", campaignId).limit(1).maybeSingle(),
    supabase
      .from("campaign_workflows")
      .select("*")
      .eq("campaign_id", campaignId)
      .limit(1)
      .maybeSingle(),
    supabase
      .from("campaign_assignments")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("campaign_stages")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("stage_order", { ascending: true }),
    supabase
      .from("assets")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("asset_versions")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("creative_tasks")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("revision_items")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase
      .from("pilot_requests")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("submitted_at", { ascending: false }),
    supabase.from("creative_profiles").select("*").order("display_name", { ascending: true }),
  ]);

  assertSupabaseResult(campaignError, "Failed to load ops campaign detail");
  assertSupabaseResult(workflowError, "Failed to load ops workflow detail");
  assertSupabaseResult(assignmentError, "Failed to load ops assignment detail");
  assertSupabaseResult(stageError, "Failed to load ops stage detail");
  assertSupabaseResult(assetError, "Failed to load ops asset detail");
  assertSupabaseResult(versionError, "Failed to load ops version detail");
  assertSupabaseResult(taskError, "Failed to load ops task detail");
  assertSupabaseResult(revisionError, "Failed to load ops revision detail");
  assertSupabaseResult(requestError, "Failed to load ops request detail");
  assertSupabaseResult(creativeProfileError, "Failed to load ops creative profile detail");

  const campaign = campaignRow ? mapCampaign(campaignRow) : null;
  if (!campaign || campaign.organizationId !== organizationId) {
    return null;
  }

  const workflow = workflowRow ? mapCampaignWorkflow(workflowRow) : null;
  const stages = (stageRows ?? []).map(mapCampaignStage);
  const assignments = (assignmentRows ?? []).map(mapCampaignAssignment);
  const tasks = (taskRows ?? []).map(mapCreativeTask);
  const versions = (versionRows ?? []).map(mapAssetVersion);
  const revisions = (revisionRows ?? []).map(mapRevisionItem);
  const pilotRequests = (requestRows ?? []).map(mapPilotRequest);
  const creativeProfiles = (creativeProfileRows ?? []).map(mapCreativeProfile);
  const assets = (assetRows ?? []).map(mapAsset).map(decorateWorkspaceAssetMedia);

  const assetIds = assets.map((asset) => asset.id);
  const unresolvedReviewCount =
    assetIds.length > 0
      ? await supabase
          .from("review_threads")
          .select("id", { count: "exact", head: true })
          .in("asset_id", assetIds)
          .is("resolved_at", null)
          .then(({ count, error }) => {
            assertSupabaseResult(error, "Failed to load ops unresolved review threads");
            return count ?? 0;
          })
      : 0;

  const readiness = getBrandWorkspaceReadiness({
    stageItems: stages,
    latestAssets: assets,
    openReviewCount: unresolvedReviewCount,
    workflowState: workflow,
  });

  const assignmentsDetailed = assignments.map((assignment) => ({
    ...assignment,
    creativeProfile: creativeProfiles.find((profile) => profile.userId === assignment.userId) ?? null,
    tasks: tasks.filter((task) => task.assignmentId === assignment.id),
    revisions: revisions.filter((revision) => revision.assignmentId === assignment.id),
  }));

  const assetsDetailed = assets.map((asset) => ({
    ...asset,
    versions: versions.filter((version) => version.assetId === asset.id),
    revisions: revisions.filter((revision) => revision.assetId === asset.id),
    tasks: tasks.filter((task) => task.assetId === asset.id),
  }));

  const auditFeed = deriveOpsAuditFeed({
    campaigns: [{ id: campaign.id, name: campaign.name }],
    workflows: workflow ? [workflow] : [],
    assignments,
    versions: versions.map((version) => ({
      id: version.id,
      campaignId: version.campaignId,
      versionLabel: version.versionLabel,
      submissionStatus: version.submissionStatus,
      createdAt: version.createdAt,
    })),
    revisions,
    requests: pilotRequests,
    creativeProfiles,
  });

  return {
    campaign,
    workflow,
    stages,
    readiness,
    assignments: assignmentsDetailed,
    tasks,
    assets: assetsDetailed,
    versions,
    revisions,
    pilotRequests,
    availableCreatives: creativeProfiles,
    summary: {
      unresolvedReviewCount,
      approvedAssetCount: readiness.approvedAssetCount,
      openRevisionCount: revisions.filter((revision) => revision.status !== "resolved").length,
      blockedTaskCount: tasks.filter((task) => task.status === "blocked").length,
      awaitingOpsReviewCount: versions.filter(
        (version) => version.submissionStatus === "submitted_for_ops_review",
      ).length,
      awaitingBrandReviewCount: versions.filter(
        (version) => version.submissionStatus === "submitted_for_brand_review",
      ).length,
      submittedAssignmentCount: assignments.filter((assignment) => assignment.status === "submitted").length,
      commercialReady: readiness.showCommercialStep,
    },
    auditFeed,
  };
}
