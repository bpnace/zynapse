import {
  assertSupabaseResult,
  mapBrief,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { parseBriefReferences } from "@/lib/workspace/briefs/form-helpers";

export async function getBriefsList(organizationId: string) {
  const supabase = requireServiceRoleClient();

  const { data, error } = await supabase
    .from("briefs")
    .select("*")
    .eq("organization_id", organizationId)
    .order("started_at", { ascending: false });

  assertSupabaseResult(error, "Failed to load briefs");

  return (data ?? []).map(mapBrief);
}

export async function getBriefView(organizationId: string, briefId: string) {
  const supabase = requireServiceRoleClient();

  const { data, error } = await supabase
    .from("briefs")
    .select("*")
    .eq("id", briefId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(error, "Failed to load brief");

  const brief = data ? mapBrief(data) : null;

  if (!brief || brief.organizationId !== organizationId) {
    return null;
  }

  const references = parseBriefReferences(brief.referencesJson);

  return {
    brief,
    values: {
      title: brief.title,
      objective: brief.objective,
      offer: brief.offer,
      audience: brief.audience,
      channels: brief.channels,
      hooks: references.hooks,
      creativeReferences: references.creativeReferences,
      budgetRange: brief.budgetRange,
      timeline: brief.timeline,
      approvalNotes: brief.approvalNotes,
    },
  };
}
