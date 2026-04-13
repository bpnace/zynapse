import type { User } from "@supabase/supabase-js";
import {
  assertSupabaseResult,
  mapInvite,
  mapMembership,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";

export async function ensureMembershipForCurrentUser(user: User) {
  const supabase = requireServiceRoleClient();

  const { data: existingMembershipRow, error: existingMembershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(existingMembershipError, "Failed to load existing membership");

  const existingMembership = existingMembershipRow ? mapMembership(existingMembershipRow) : null;

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
        role: activeInvite.role,
      },
      {
        onConflict: "user_id",
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
