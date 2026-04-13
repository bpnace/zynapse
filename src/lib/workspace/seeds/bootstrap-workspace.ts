import {
  assertSupabaseResult,
  mapCampaign,
  mapInvite,
  mapOrganization,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { getSeedTemplate } from "@/lib/workspace/seeds/templates";

export async function bootstrapWorkspaceForOrganization(organizationId: string) {
  const supabase = requireServiceRoleClient();

  const { data: existingCampaignRow, error: existingCampaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("organization_id", organizationId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(existingCampaignError, "Failed to check existing campaign");

  if (existingCampaignRow) {
    return mapCampaign(existingCampaignRow);
  }

  const { data: organizationRow, error: organizationError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(organizationError, "Failed to load organization for bootstrap");

  const organization = organizationRow ? mapOrganization(organizationRow) : null;

  if (!organization) {
    throw new Error("Cannot bootstrap workspace without organization.");
  }

  const { data: sourceInviteRows, error: sourceInviteError } = await supabase
    .from("invites")
    .select("*")
    .eq("organization_id", organizationId)
    .order("accepted_at", { ascending: false, nullsFirst: false })
    .order("expires_at", { ascending: false })
    .limit(1);

  assertSupabaseResult(sourceInviteError, "Failed to load bootstrap invite");

  const sourceInvite = sourceInviteRows?.[0] ? mapInvite(sourceInviteRows[0]) : null;
  const template = getSeedTemplate(sourceInvite?.seedTemplateKey);

  const { error: organizationUpdateError } = await supabase
    .from("organizations")
    .update({
      status: "active",
    })
    .eq("id", organizationId);

  assertSupabaseResult(organizationUpdateError, "Failed to activate organization");

  const { data: existingBrandProfileRow, error: existingBrandProfileError } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("organization_id", organizationId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(
    existingBrandProfileError,
    "Failed to check existing brand profile",
  );

  if (!existingBrandProfileRow) {
    const { error: brandProfileInsertError } = await supabase
      .from("brand_profiles")
      .insert({
        organization_id: organizationId,
        website: `https://${organization.slug}.example.com`,
        offer_summary: template.brandProfile.offerSummary,
        target_audience: template.brandProfile.targetAudience,
        primary_channels: template.brandProfile.primaryChannels,
        brand_tone: template.brandProfile.brandTone,
        review_notes: template.brandProfile.reviewNotes,
        claim_guardrails: template.brandProfile.claimGuardrails,
      });

    assertSupabaseResult(brandProfileInsertError, "Failed to create brand profile");
  }

  const { data: campaignRow, error: campaignInsertError } = await supabase
    .from("campaigns")
    .insert({
      organization_id: organizationId,
      name: template.campaignName,
      current_stage: template.currentStage,
      package_tier: template.packageTier,
      seeded_template_key: template.key,
      campaign_goal: template.campaignGoal,
    })
    .select("*")
    .single();

  assertSupabaseResult(campaignInsertError, "Failed to create campaign");

  if (!campaignRow) {
    throw new Error("Failed to create campaign: missing inserted row.");
  }

  const campaign = mapCampaign(campaignRow);

  const { error: campaignStageInsertError } = await supabase
    .from("campaign_stages")
    .insert(
      template.stageDefinitions.map((stage, index) => ({
        campaign_id: campaign.id,
        stage_key: stage.key,
        stage_order: index + 1,
        status: stage.status,
        started_at:
          stage.status === "completed" || stage.status === "in_progress"
            ? new Date().toISOString()
            : null,
        completed_at: stage.status === "completed" ? new Date().toISOString() : null,
      })),
    );

  assertSupabaseResult(campaignStageInsertError, "Failed to create campaign stages");

  const { data: insertedAssetRows, error: assetInsertError } = await supabase
    .from("assets")
    .insert(
      template.assets.map((asset) => ({
        campaign_id: campaign.id,
        asset_scope: "output" as const,
        asset_type: asset.assetType,
        title: asset.title,
        format: asset.format,
        duration_seconds: asset.durationSeconds ?? null,
        storage_path: asset.storagePath,
        thumbnail_path: asset.thumbnailPath,
        source: asset.source,
        version_label: asset.versionLabel,
        review_status: asset.reviewStatus,
      })),
    )
    .select("*");

  assertSupabaseResult(assetInsertError, "Failed to create campaign assets");

  const assetMap = new Map(
    template.assets.map((asset, index) => [asset.key, insertedAssetRows?.[index]]),
  );

  for (const thread of template.reviewThreads) {
    const assetRow = assetMap.get(thread.assetKey);

    if (!assetRow) {
      continue;
    }

    const { data: insertedThreadRow, error: reviewThreadInsertError } = await supabase
      .from("review_threads")
      .insert({
        asset_id: assetRow.id,
        created_by: thread.createdBy,
        anchor_json: thread.anchorJson,
      })
      .select("*")
      .single();

    assertSupabaseResult(reviewThreadInsertError, "Failed to create review thread");

    if (!insertedThreadRow) {
      throw new Error("Failed to create review thread: missing inserted row.");
    }

    const { error: commentInsertError } = await supabase
      .from("comments")
      .insert(
        thread.comments.map((comment) => ({
          thread_id: insertedThreadRow.id,
          author_id: comment.authorId,
          body: comment.body,
          comment_type: comment.commentType,
        })),
      );

    assertSupabaseResult(commentInsertError, "Failed to create review comments");
  }

  return campaign;
}
