import { config as loadEnv } from "dotenv";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import demoTemplate from "../src/lib/workspace/seeds/templates/d2c-product-launch.data.json" with { type: "json" };
import {
  buildDemoWorkspaceParticipants,
  deriveWorkflowSeedState,
} from "./reset-demo-workspace.fixture.mjs";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

const canonicalDemoEmail =
  process.env.DEMO_WORKSPACE_EMAIL ??
  process.env.E2E_WORKSPACE_EMAIL ??
  "demo@zynapse.eu";
const canonicalDemoOrganizationSlug =
  process.env.DEMO_WORKSPACE_ORGANIZATION_SLUG ?? "zynapse-closed-demo";
const canonicalDemoOrganizationName =
  process.env.DEMO_WORKSPACE_NAME ?? "Zynapse Closed Demo";
const canonicalCreativeEmail =
  process.env.DEMO_WORKSPACE_CREATIVE_EMAIL ?? null;
const canonicalOpsEmail = process.env.DEMO_WORKSPACE_OPS_EMAIL ?? null;

function parseArgs(argv) {
  const args = {
    email: canonicalDemoEmail,
    password: process.env.E2E_WORKSPACE_PASSWORD ?? "",
    creativeEmail: canonicalCreativeEmail,
    opsEmail: canonicalOpsEmail,
    template: "d2c_product_launch",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--email" && next) {
      args.email = next;
      index += 1;
      continue;
    }

    if (current === "--password" && next) {
      args.password = next;
      index += 1;
      continue;
    }

    if (current === "--creative-email" && next) {
      args.creativeEmail = next;
      index += 1;
      continue;
    }

    if (current === "--ops-email" && next) {
      args.opsEmail = next;
      index += 1;
      continue;
    }

    if (current === "--template" && next) {
      args.template = next;
      index += 1;
    }
  }

  return args;
}

function titleize(input) {
  return input
    .split(/[\W_]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
function assertResult(error, context) {
  if (error) {
    throw new Error(`${context}: ${error.message ?? "Unknown Supabase error"}`);
  }
}

function deriveCreativeIdentity(email) {
  const normalizedEmail = email?.trim().toLowerCase() ?? "creative@zynapse.eu";
  const handle = normalizedEmail.split("@")[0] ?? "creative";
  const words = handle
    .split(/[._+-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return {
    slug: handle.replace(/[^a-z0-9-]/g, "-"),
    displayName: words.join(" ") || "Creative Partner",
  };
}

function mapAssignmentRole(role) {
  return role === "creative_lead" ? "creative_lead" : "creative";
}

async function ensureAuthUser(supabase, email, password) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  assertResult(error, "Failed to list auth users");

  const existingUser = data?.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!existingUser) {
    const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    assertResult(createError, "Failed to create auth user");

    if (!createdUser?.user) {
      throw new Error("Failed to create auth user: missing user payload");
    }

    return createdUser.user;
  }

  const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
    existingUser.id,
    {
      password,
      email_confirm: true,
    },
  );

  assertResult(updateError, "Failed to update auth user password");

  if (!updatedUser?.user) {
    throw new Error("Failed to update auth user: missing user payload");
  }

  return updatedUser.user;
}

async function ensureOrganization(supabase, email) {
  const slug = canonicalDemoOrganizationSlug;
  const defaultName =
    email.trim().toLowerCase() === canonicalDemoEmail.toLowerCase()
      ? canonicalDemoOrganizationName
      : `${titleize(email.split("@")[0] ?? "Workspace")} Demo Workspace`;

  const { data: inviteRows, error: inviteLookupError } = await supabase
    .from("invites")
    .select("*")
    .ilike("email", email)
    .order("accepted_at", { ascending: false, nullsFirst: false })
    .order("expires_at", { ascending: false })
    .limit(1);

  assertResult(inviteLookupError, "Failed to look up existing invite");

  const existingInvite = inviteRows?.[0] ?? null;

  if (existingInvite?.organization_id) {
    const { data: existingOrganization, error: organizationError } = await supabase
      .from("organizations")
      .update({
        name: defaultName,
        slug,
        industry: "Demo / Beauty",
        status: "active",
      })
      .eq("id", existingInvite.organization_id)
      .select("*")
      .single();

    assertResult(organizationError, "Failed to update existing organization");

    return existingOrganization;
  }

  const { data: organizationRows, error: organizationLookupError } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .limit(1);

  assertResult(organizationLookupError, "Failed to look up organization by slug");

  const existingOrganization = organizationRows?.[0] ?? null;

  if (existingOrganization) {
    const { data: updatedOrganization, error: updateError } = await supabase
      .from("organizations")
      .update({
        name: defaultName,
        industry: "Demo / Beauty",
        status: "active",
      })
      .eq("id", existingOrganization.id)
      .select("*")
      .single();

    assertResult(updateError, "Failed to update organization by slug");

    return updatedOrganization;
  }

  const { data: createdOrganization, error: createError } = await supabase
    .from("organizations")
    .insert({
      name: defaultName,
      slug,
      industry: "Demo / Beauty",
      status: "active",
    })
    .select("*")
    .single();

  assertResult(createError, "Failed to create organization");

  return createdOrganization;
}

async function resetSeedState(supabase, organizationId) {
  const { error: pilotRequestDeleteError } = await supabase
    .from("pilot_requests")
    .delete()
    .eq("organization_id", organizationId);

  assertResult(pilotRequestDeleteError, "Failed to delete pilot requests");

  const { error: briefDeleteError } = await supabase
    .from("briefs")
    .delete()
    .eq("organization_id", organizationId);

  assertResult(briefDeleteError, "Failed to delete briefs");

  const { error: campaignDeleteError } = await supabase
    .from("campaigns")
    .delete()
    .eq("organization_id", organizationId);

  assertResult(campaignDeleteError, "Failed to delete campaigns");
}

async function upsertParticipantAccess(supabase, input) {
  const { organizationId, templateKey, participant, userId, acceptedAt } = input;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();

  const { error: inviteError } = await supabase
    .from("invites")
    .upsert(
      {
        organization_id: organizationId,
        email: participant.email,
        role: participant.role,
        seed_template_key: templateKey,
        expires_at: expiresAt,
        accepted_at: acceptedAt,
      },
      { onConflict: "organization_id,email" },
    );

  assertResult(inviteError, `Failed to upsert ${participant.key} invite`);

  const { error: membershipError } = await supabase
    .from("memberships")
    .upsert(
      {
        organization_id: organizationId,
        user_id: userId,
        role: participant.role,
        workspace_type: participant.workspaceType,
        membership_status: "active",
        accepted_at: acceptedAt,
      },
      { onConflict: "organization_id,user_id" },
    );

  assertResult(membershipError, `Failed to upsert ${participant.key} membership`);
}

async function seedWorkspace(supabase, organization, participants) {
  const template = demoTemplate;
  const brandParticipant = participants.find(
    ({ participant }) => participant.workspaceType === "brand",
  );
  const creativeParticipant = participants.find(
    ({ participant }) => participant.workspaceType === "creative",
  );
  const opsParticipant = participants.find(
    ({ participant }) => participant.workspaceType === "ops",
  );

  if (!brandParticipant) {
    throw new Error("Failed to seed demo workspace: missing brand participant.");
  }

  const { error: brandProfileError } = await supabase
    .from("brand_profiles")
    .upsert(
      {
        organization_id: organization.id,
        website: `https://${organization.slug}.example.com`,
        offer_summary: template.brandProfile.offerSummary,
        target_audience: template.brandProfile.targetAudience,
        primary_channels: template.brandProfile.primaryChannels,
        brand_tone: template.brandProfile.brandTone,
        review_notes: template.brandProfile.reviewNotes,
        claim_guardrails: template.brandProfile.claimGuardrails,
      },
      { onConflict: "organization_id" },
    );

  assertResult(brandProfileError, "Failed to upsert brand profile");
  const nowIso = new Date().toISOString();

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .insert({
      organization_id: organization.id,
      name: template.campaignName,
      current_stage: template.currentStage,
      package_tier: template.packageTier,
      seeded_template_key: template.key,
      campaign_goal: template.campaignGoal,
    })
    .select("*")
    .single();

  assertResult(campaignError, "Failed to create demo campaign");

  const { error: stageError } = await supabase.from("campaign_stages").insert(
    template.stageDefinitions.map((stage, index) => ({
      campaign_id: campaign.id,
      stage_key: stage.key,
      stage_order: index + 1,
      status: stage.status,
      started_at:
        stage.status === "completed" || stage.status === "in_progress"
          ? nowIso
          : null,
      completed_at: stage.status === "completed" ? nowIso : null,
    })),
  );

  assertResult(stageError, "Failed to create campaign stages");

  const workflowSeedState = deriveWorkflowSeedState(template.currentStage);
  const { error: workflowError } = await supabase
    .from("campaign_workflows")
    .upsert(
      {
        campaign_id: campaign.id,
        ops_owner_user_id: opsParticipant?.user.id ?? null,
        workflow_status: workflowSeedState.workflowStatus,
        review_status: workflowSeedState.reviewStatus,
        delivery_status: workflowSeedState.deliveryStatus,
        commercial_status: workflowSeedState.commercialStatus,
        last_transition_at: nowIso,
      },
      { onConflict: "campaign_id" },
    );

  assertResult(workflowError, "Failed to create campaign workflow");

  const { data: insertedAssets, error: assetError } = await supabase
    .from("assets")
    .insert(
      template.assets.map((asset) => ({
        campaign_id: campaign.id,
        asset_scope: "output",
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

  assertResult(assetError, "Failed to create demo assets");

  const assetByKey = new Map(
    template.assets.map((asset, index) => [asset.key, insertedAssets?.[index] ?? null]),
  );

  for (const thread of template.reviewThreads) {
    const targetAsset = assetByKey.get(thread.assetKey);

    if (!targetAsset) {
      continue;
    }

    const { data: insertedThread, error: threadError } = await supabase
      .from("review_threads")
      .insert({
        asset_id: targetAsset.id,
        created_by: thread.createdBy,
        anchor_json: thread.anchorJson ?? null,
      })
      .select("*")
      .single();

    assertResult(threadError, "Failed to create review thread");

    const { error: commentError } = await supabase.from("comments").insert(
      thread.comments.map((comment) => ({
        thread_id: insertedThread.id,
        author_id: comment.authorId,
        body: comment.body,
        comment_type: comment.commentType,
      })),
    );

    assertResult(commentError, "Failed to create review comments");
  }

  if (creativeParticipant && insertedAssets?.length) {
    const creativeIdentity = deriveCreativeIdentity(creativeParticipant.participant.email);
    const { error: creativeProfileError } = await supabase
      .from("creative_profiles")
      .upsert(
        {
          user_id: creativeParticipant.user.id,
          slug: creativeIdentity.slug,
          display_name: creativeIdentity.displayName,
          headline: "Curated creative execution partner",
          bio: "Focused on creative production, revisions, and delivery-readiness handoffs.",
          specialties: "Concepting, Prompting, Motion, Delivery",
          portfolio_url: null,
          availability_status: "active",
        },
        { onConflict: "user_id" },
      );

    assertResult(creativeProfileError, "Failed to upsert creative profile");

    const { data: assignment, error: assignmentError } = await supabase
      .from("campaign_assignments")
      .upsert(
        {
          campaign_id: campaign.id,
          user_id: creativeParticipant.user.id,
          assignment_role: mapAssignmentRole(creativeParticipant.participant.role),
          status: "in_progress",
          assigned_by: opsParticipant?.user.id ?? null,
          scope_summary:
            "Own the current delivery sprint, tighten variants, and respond to review feedback quickly.",
          due_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
          accepted_at: nowIso,
        },
        { onConflict: "campaign_id,user_id" },
      )
      .select("*")
      .single();

    assertResult(assignmentError, "Failed to upsert campaign assignment");

    const seededTasks = insertedAssets.slice(0, 2).map((asset, index) => ({
      campaign_id: campaign.id,
      assignment_id: assignment.id,
      asset_id: asset.id,
      owner_user_id: creativeParticipant.user.id,
      title: `${index === 0 ? "Refine" : "Package"} ${asset.title}`,
      description:
        index === 0
          ? "Tighten the current hook, CTA framing, and proof sequencing for the next review."
          : "Prepare the approved cut with clean naming, thumbnail coverage, and handoff-ready notes.",
      task_type: index === 0 ? "revision" : "delivery",
      status: index === 0 ? "in_progress" : "todo",
      priority: index === 0 ? "high" : "medium",
      due_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    }));

    const { error: taskError } = await supabase.from("creative_tasks").insert(seededTasks);

    assertResult(taskError, "Failed to create creative tasks");

    const submissionAsset =
      insertedAssets.find((asset) => asset.review_status !== "approved") ?? insertedAssets[0];
    const { error: versionError } = await supabase.from("asset_versions").insert({
      asset_id: submissionAsset.id,
      campaign_id: campaign.id,
      assignment_id: assignment.id,
      created_by: creativeParticipant.user.id,
      version_label: `${submissionAsset.version_label ?? "v1"}-ops-review`,
      storage_path: submissionAsset.storage_path,
      thumbnail_path: submissionAsset.thumbnail_path,
      notes: "Seeded demo submission for ops review coverage.",
      submission_status: "submitted_for_ops_review",
    });

    assertResult(versionError, "Failed to create seeded asset version");

    const revisionItems = template.reviewThreads.flatMap((thread) => {
      const targetAsset = assetByKey.get(thread.assetKey);
      const sourceComment = thread.comments.find(
        (comment) => comment.commentType === "change_request",
      );

      if (!targetAsset || !sourceComment) {
        return [];
      }

      return [
        {
          campaign_id: campaign.id,
          assignment_id: assignment.id,
          asset_id: targetAsset.id,
          created_by: opsParticipant?.user.id ?? sourceComment.authorId,
          title: `Resolve feedback for ${targetAsset.title}`,
          detail: sourceComment.body,
          status: "open",
          priority: "high",
        },
      ];
    });

    if (revisionItems.length > 0) {
      const { error: revisionError } = await supabase
        .from("revision_items")
        .insert(revisionItems);

      assertResult(revisionError, "Failed to create revision queue items");
    }
  }

  return campaign;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.email) {
    throw new Error(
      "Missing email. Run `pnpm demo:reset -- --email demo@zynapse.eu [--password your-password]`.",
    );
  }

  if (!args.password) {
    throw new Error(
      "Missing password. Provide `--password` or set E2E_WORKSPACE_PASSWORD.",
    );
  }

  if (args.template !== "d2c_product_launch") {
    throw new Error(
      `Unsupported template '${args.template}'. The Phase 4 demo reset currently supports only d2c_product_launch.`,
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const participants = buildDemoWorkspaceParticipants({
    canonicalBrandEmail: canonicalDemoEmail,
    requestedBrandEmail: args.email,
    creativeEmail: args.creativeEmail,
    opsEmail: args.opsEmail,
  });

  const users = await Promise.all(
    participants.map(async (participant) => ({
      participant,
      user: await ensureAuthUser(supabase, participant.email, args.password),
    })),
  );
  const organization = await ensureOrganization(supabase, canonicalDemoEmail);

  await resetSeedState(supabase, organization.id);
  const campaign = await seedWorkspace(supabase, organization, users);

  const acceptedAt = new Date().toISOString();
  await Promise.all(
    users.map(({ participant, user }) =>
      upsertParticipantAccess(supabase, {
        organizationId: organization.id,
        templateKey: demoTemplate.key,
        participant,
        userId: user.id,
        acceptedAt,
      }),
    ),
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        email: args.email,
        organizationId: organization.id,
        organizationSlug: organization.slug,
        campaignId: campaign.id,
        brandLoginEmail: canonicalDemoEmail,
        participants: participants.map((participant) => ({
          email: participant.email,
          role: participant.role,
          workspaceType: participant.workspaceType,
        })),
        template: args.template,
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
