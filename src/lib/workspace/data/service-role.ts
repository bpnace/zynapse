import { createServiceRoleSupabaseClient } from "@/lib/auth/admin";
import type { TableRow, WorkspaceDatabase } from "@/lib/workspace/data/types";

function parseDate(value: string | null | undefined) {
  return value ? new Date(value) : null;
}

export function requireServiceRoleClient() {
  const supabase = createServiceRoleSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase service role client is not configured.");
  }

  return supabase;
}

export function assertSupabaseResult(
  error: { message?: string } | null,
  context: string,
) {
  if (error) {
    throw new Error(`${context}: ${error.message ?? "Unknown Supabase error"}`);
  }
}

export function mapOrganization(row: TableRow<"organizations">) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    industry: row.industry,
    status: row.status,
    createdAt: parseDate(row.created_at) ?? new Date(0),
  };
}

export function mapInvite(row: TableRow<"invites">) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    email: row.email,
    role: row.role,
    seedTemplateKey: row.seed_template_key,
    expiresAt: parseDate(row.expires_at) ?? new Date(0),
    acceptedAt: parseDate(row.accepted_at),
  };
}

export function mapMembership(row: TableRow<"memberships">) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    role: row.role,
    workspaceType: row.workspace_type,
    membershipStatus: row.membership_status,
    invitedBy: row.invited_by,
    acceptedAt: parseDate(row.accepted_at) ?? new Date(0),
  };
}

export function mapBrandProfile(row: TableRow<"brand_profiles">) {
  return {
    organizationId: row.organization_id,
    website: row.website,
    offerSummary: row.offer_summary,
    targetAudience: row.target_audience,
    primaryChannels: row.primary_channels,
    brandTone: row.brand_tone,
    reviewNotes: row.review_notes,
    claimGuardrails: row.claim_guardrails,
    updatedAt: parseDate(row.updated_at) ?? new Date(0),
  };
}

export function mapCreativeProfile(row: TableRow<"creative_profiles">) {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    displayName: row.display_name,
    headline: row.headline,
    bio: row.bio,
    specialties: row.specialties,
    portfolioUrl: row.portfolio_url,
    availabilityStatus: row.availability_status,
    createdAt: parseDate(row.created_at) ?? new Date(0),
  };
}

export function mapCampaign(row: TableRow<"campaigns">) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    briefId: row.brief_id,
    name: row.name,
    currentStage: row.current_stage,
    packageTier: row.package_tier,
    seededTemplateKey: row.seeded_template_key,
    campaignGoal: row.campaign_goal,
    createdAt: parseDate(row.created_at) ?? new Date(0),
  };
}

export function mapCampaignWorkflow(row: TableRow<"campaign_workflows">) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    opsOwnerUserId: row.ops_owner_user_id,
    workflowStatus: row.workflow_status,
    reviewStatus: row.review_status,
    deliveryStatus: row.delivery_status,
    commercialStatus: row.commercial_status,
    blockedReason: row.blocked_reason,
    slaDueAt: parseDate(row.sla_due_at),
    lastTransitionAt: parseDate(row.last_transition_at) ?? new Date(0),
  };
}

export function mapCampaignAssignment(row: TableRow<"campaign_assignments">) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    userId: row.user_id,
    assignmentRole: row.assignment_role,
    status: row.status,
    assignedBy: row.assigned_by,
    scopeSummary: row.scope_summary,
    dueAt: parseDate(row.due_at),
    acceptedAt: parseDate(row.accepted_at),
    submittedAt: parseDate(row.submitted_at),
    createdAt: parseDate(row.created_at) ?? new Date(0),
  };
}

export function mapCampaignStage(row: TableRow<"campaign_stages">) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    stageKey: row.stage_key,
    stageOrder: row.stage_order,
    status: row.status,
    startedAt: parseDate(row.started_at),
    completedAt: parseDate(row.completed_at),
  };
}

export function mapCreativeTask(row: TableRow<"creative_tasks">) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    assignmentId: row.assignment_id,
    assetId: row.asset_id,
    ownerUserId: row.owner_user_id,
    title: row.title,
    description: row.description,
    taskType: row.task_type,
    status: row.status,
    priority: row.priority,
    blockedReason: row.blocked_reason,
    dueAt: parseDate(row.due_at),
    submittedAt: parseDate(row.submitted_at),
    completedAt: parseDate(row.completed_at),
    createdAt: parseDate(row.created_at) ?? new Date(0),
  };
}

export function mapAsset(row: TableRow<"assets">) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    briefId: row.brief_id,
    assetScope: row.asset_scope,
    assetType: row.asset_type,
    title: row.title,
    format: row.format,
    durationSeconds: row.duration_seconds,
    storagePath: row.storage_path,
    thumbnailPath: row.thumbnail_path,
    source: row.source,
    versionLabel: row.version_label,
    reviewStatus: row.review_status,
    createdAt: parseDate(row.created_at) ?? new Date(0),
  };
}

export function mapAssetVersion(row: TableRow<"asset_versions">) {
  return {
    id: row.id,
    assetId: row.asset_id,
    campaignId: row.campaign_id,
    assignmentId: row.assignment_id,
    createdBy: row.created_by,
    versionLabel: row.version_label,
    storagePath: row.storage_path,
    thumbnailPath: row.thumbnail_path,
    notes: row.notes,
    submissionStatus: row.submission_status,
    createdAt: parseDate(row.created_at) ?? new Date(0),
  };
}

export function mapReviewThread(row: TableRow<"review_threads">) {
  return {
    id: row.id,
    assetId: row.asset_id,
    createdBy: row.created_by,
    anchorJson: row.anchor_json,
    resolvedAt: parseDate(row.resolved_at),
  };
}

export function mapComment(row: TableRow<"comments">) {
  return {
    id: row.id,
    threadId: row.thread_id,
    authorId: row.author_id,
    body: row.body,
    commentType: row.comment_type,
    createdAt: parseDate(row.created_at) ?? new Date(0),
  };
}

export function mapRevisionItem(row: TableRow<"revision_items">) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    assignmentId: row.assignment_id,
    assetId: row.asset_id,
    reviewThreadId: row.review_thread_id,
    sourceCommentId: row.source_comment_id,
    createdBy: row.created_by,
    title: row.title,
    detail: row.detail,
    status: row.status,
    priority: row.priority,
    createdAt: parseDate(row.created_at) ?? new Date(0),
    resolvedAt: parseDate(row.resolved_at),
  };
}

export function mapBrief(row: TableRow<"briefs">) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    createdBy: row.created_by,
    title: row.title,
    status: row.status,
    objective: row.objective,
    offer: row.offer,
    audience: row.audience,
    channels: row.channels,
    referencesJson: row.references_json,
    budgetRange: row.budget_range,
    timeline: row.timeline,
    approvalNotes: row.approval_notes,
    startedAt: parseDate(row.started_at) ?? new Date(0),
    submittedAt: parseDate(row.submitted_at),
  };
}

export function mapPilotRequest(row: TableRow<"pilot_requests">) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    campaignId: row.campaign_id,
    requestedBy: row.requested_by,
    desiredTier: row.desired_tier,
    startWindow: row.start_window,
    internalStakeholders: row.internal_stakeholders,
    message: row.message,
    status: row.status,
    handoffMode: row.handoff_mode,
    submittedAt: parseDate(row.submitted_at) ?? new Date(0),
  };
}

export type ServiceRoleClient = ReturnType<typeof createServiceRoleSupabaseClient>;
export type WorkspaceServiceDatabase = WorkspaceDatabase;
