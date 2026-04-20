import { config as loadEnv } from "dotenv";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";
import demoTemplate from "../src/lib/workspace/seeds/templates/d2c-product-launch.data.json" with { type: "json" };

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
const defaultCreativeDemoEmail =
  process.env.DEMO_CREATIVE_WORKSPACE_EMAIL ?? "creative-demo@zynapse.eu";
const defaultOpsDemoEmail =
  process.env.DEMO_OPS_WORKSPACE_EMAIL ?? "ops-demo@zynapse.eu";

function parseArgs(argv) {
  const args = {
    email: canonicalDemoEmail,
    password: process.env.E2E_WORKSPACE_PASSWORD ?? "",
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

async function seedWorkspace(supabase, organization, user, email) {
  const template = demoTemplate;
  const nowIso = new Date().toISOString();

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

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();

  const { error: inviteError } = await supabase
    .from("invites")
    .upsert(
      {
        organization_id: organization.id,
        email,
        role: "brand_reviewer",
        seed_template_key: template.key,
        expires_at: expiresAt,
        accepted_at: nowIso,
      },
      { onConflict: "organization_id,email" },
    );

  assertResult(inviteError, "Failed to upsert invite");

  const { error: membershipError } = await supabase
    .from("memberships")
    .upsert(
      {
        organization_id: organization.id,
        user_id: user.id,
        role: "brand_reviewer",
        accepted_at: nowIso,
      },
      { onConflict: "user_id" },
    );

  assertResult(membershipError, "Failed to upsert membership");

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
      `Unsupported template '${args.template}'. Phase 1 supports only d2c_product_launch.`,
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

  const user = await ensureAuthUser(supabase, args.email, args.password);
  const organization = await ensureOrganization(supabase, args.email);

  await resetSeedState(supabase, organization.id);
  const campaign = await seedWorkspace(supabase, organization, user, args.email);

  console.log(
    JSON.stringify(
      {
        ok: true,
        email: args.email,
        organizationId: organization.id,
        organizationSlug: organization.slug,
        campaignId: campaign.id,
        template: args.template,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
