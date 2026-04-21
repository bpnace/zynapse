import { getWorkspaceTypeForRole, normalizeWorkspaceRole } from "@/lib/auth/roles";
import type { User } from "@supabase/supabase-js";
import {
  assertSupabaseResult,
  mapInvite,
  mapMembership,
  mapOrganization,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import {
  getDemoWorkspaceConfig,
  isPrimaryDemoWorkspaceEmail,
} from "@/lib/workspace/demo";

export async function ensureMembershipForCurrentUser(user: User) {
  const supabase = requireServiceRoleClient();
  const demoConfig = getDemoWorkspaceConfig();

  const { data: existingMembershipRows, error: existingMembershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .order("accepted_at", { ascending: false });

  assertSupabaseResult(existingMembershipError, "Failed to load existing membership");

  const existingMemberships = (existingMembershipRows ?? []).map(mapMembership);

  if (
    isPrimaryDemoWorkspaceEmail(user.email) &&
    demoConfig.isEnabled
  ) {
    const { data: demoOrganizationRow, error: demoOrganizationError } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", demoConfig.organizationSlug)
      .limit(1)
      .maybeSingle();

    assertSupabaseResult(
      demoOrganizationError,
      "Failed to load canonical demo workspace organization",
    );

    const demoOrganization = demoOrganizationRow
      ? mapOrganization(demoOrganizationRow)
      : null;

    if (!demoOrganization) {
      return null;
    }

    const existingDemoMembership =
      existingMemberships.find(
        (membership) => membership.organizationId === demoOrganization.id,
      ) ?? null;

    if (existingDemoMembership) {
      return existingDemoMembership;
    }

    const { data: membershipRows, error: membershipInsertError } = await supabase
      .from("memberships")
      .upsert(
        {
          organization_id: demoOrganization.id,
          user_id: user.id,
          role: "brand_reviewer",
          workspace_type: "brand",
          membership_status: "active",
          accepted_at: new Date().toISOString(),
        },
        {
          onConflict: "organization_id,user_id",
        },
      )
      .select();

    assertSupabaseResult(
      membershipInsertError,
      "Failed to provision canonical demo workspace membership",
    );

    const membershipRow = membershipRows?.[0] ?? null;

    if (membershipRow) {
      return mapMembership(membershipRow);
    }

    return null;
  }

  const existingMembership = existingMemberships[0] ?? null;

  if (existingMembership) {
    return existingMembership;
  }

  const email = user.email;

  if (!email) {
    return null;
  }

  const { data: transactionMembershipRow, error: transactionMembershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(
    transactionMembershipError,
    "Failed to re-check membership for current user",
  );

  const transactionMembership = transactionMembershipRow
    ? mapMembership(transactionMembershipRow)
    : null;

  if (transactionMembership) {
    return transactionMembership;
  }

  const { data: activeInviteRow, error: activeInviteError } = await supabase
    .from("invites")
    .select("*")
    .ilike("email", email)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(activeInviteError, "Failed to load active invite");

  const activeInvite = activeInviteRow ? mapInvite(activeInviteRow) : null;

  if (!activeInvite) {
    return null;
  }

  const { data: membershipRows, error: membershipInsertError } = await supabase
    .from("memberships")
    .upsert(
      {
        organization_id: activeInvite.organizationId,
        user_id: user.id,
        role: normalizeWorkspaceRole(activeInvite.role),
        workspace_type: getWorkspaceTypeForRole(activeInvite.role),
        membership_status: "active",
      },
      {
        onConflict: "organization_id,user_id",
      },
    )
    .select();

  assertSupabaseResult(membershipInsertError, "Failed to upsert membership");

  const membershipRow = membershipRows?.[0] ?? null;

  if (!membershipRow) {
    const { data: fallbackMembershipRow, error: fallbackMembershipError } = await supabase
      .from("memberships")
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    assertSupabaseResult(fallbackMembershipError, "Failed to reload membership");

    if (!fallbackMembershipRow) {
      return null;
    }

    return mapMembership(fallbackMembershipRow);
  }

  const { error: inviteUpdateError } = await supabase
    .from("invites")
    .update({
      accepted_at: new Date().toISOString(),
    })
    .eq("id", activeInvite.id);

  assertSupabaseResult(inviteUpdateError, "Failed to mark invite as accepted");

  return mapMembership(membershipRow);
}
