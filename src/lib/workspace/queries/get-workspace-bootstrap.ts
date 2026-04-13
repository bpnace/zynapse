import {
  assertSupabaseResult,
  mapBrandProfile,
  mapMembership,
  mapOrganization,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";

export async function getWorkspaceBootstrap(userId: string) {
  const supabase = requireServiceRoleClient();

  const { data: membershipRow, error: membershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(membershipError, "Failed to load workspace membership");

  const membership = membershipRow ? mapMembership(membershipRow) : null;

  if (!membership) {
    return null;
  }

  const { data: organizationRow, error: organizationError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", membership.organizationId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(organizationError, "Failed to load workspace organization");

  const organization = organizationRow ? mapOrganization(organizationRow) : null;

  if (!organization) {
    return null;
  }

  const { data: brandProfileRow, error: brandProfileError } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("organization_id", membership.organizationId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(brandProfileError, "Failed to load brand profile");

  const brandProfile = brandProfileRow ? mapBrandProfile(brandProfileRow) : null;

  return {
    membership,
    organization,
    brandProfile,
  };
}
