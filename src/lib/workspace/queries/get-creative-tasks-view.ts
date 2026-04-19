import {
  assertSupabaseResult,
  mapCampaign,
  mapCampaignAssignment,
  mapCreativeTask,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";

type GetCreativeTasksViewParams = {
  organizationId: string;
  userId: string;
};

export async function getCreativeTasksView({
  organizationId,
  userId,
}: GetCreativeTasksViewParams) {
  const supabase = requireServiceRoleClient();

  const [{ data: campaignRows, error: campaignError }, { data: assignmentRows, error: assignmentError }, { data: taskRows, error: taskError }] =
    await Promise.all([
      supabase
        .from("campaigns")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false }),
      supabase
        .from("campaign_assignments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("creative_tasks")
        .select("*")
        .eq("owner_user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

  assertSupabaseResult(campaignError, "Failed to load creative campaigns");
  assertSupabaseResult(assignmentError, "Failed to load creative assignments");
  assertSupabaseResult(taskError, "Failed to load creative tasks");

  const campaigns = (campaignRows ?? []).map(mapCampaign);
  const campaignMap = new Map(campaigns.map((campaign) => [campaign.id, campaign]));
  const assignments = (assignmentRows ?? [])
    .map(mapCampaignAssignment)
    .filter((assignment) => campaignMap.has(assignment.campaignId));
  const allowedCampaignIds = new Set(assignments.map((assignment) => assignment.campaignId));
  const tasks = (taskRows ?? [])
    .map(mapCreativeTask)
    .filter((task) => allowedCampaignIds.has(task.campaignId));

  const tasksByCampaign = new Map<string, typeof tasks>();

  for (const task of tasks) {
    const bucket = tasksByCampaign.get(task.campaignId) ?? [];
    bucket.push(task);
    tasksByCampaign.set(task.campaignId, bucket);
  }

  return {
    assignments: assignments.map((assignment) => ({
      ...assignment,
      campaign: campaignMap.get(assignment.campaignId) ?? null,
      tasks: tasksByCampaign.get(assignment.campaignId) ?? [],
    })),
    tasks,
    summary: {
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      todo: tasks.filter((task) => task.status === "todo").length,
      blocked: tasks.filter((task) => task.status === "blocked").length,
      submitted: tasks.filter((task) => task.status === "submitted").length,
    },
  };
}
