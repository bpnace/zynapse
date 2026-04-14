import {
  assertSupabaseResult,
  mapBrandProfile,
  mapMembership,
  mapOrganization,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import {
  getDemoWorkspaceConfig,
  getWorkspaceDemoState,
  isDemoWorkspaceEmail,
} from "@/lib/workspace/demo";

type WorkspaceBootstrapUser = {
  id: string;
  email?: string | null;
};

export async function getWorkspaceBootstrap(user: WorkspaceBootstrapUser) {
  const supabase = requireServiceRoleClient();
  const demoConfig = getDemoWorkspaceConfig();

  const demoOrganization =
    isDemoWorkspaceEmail(user.email) && demoConfig.isEnabled
      ? await supabase
          .from("organizations")
          .select("*")
          .eq("slug", demoConfig.organizationSlug)
          .limit(1)
          .maybeSingle()
          .then(({ data, error }) => {
            assertSupabaseResult(
              error,
              "Failed to load canonical demo workspace organization",
            );
            return data ? mapOrganization(data) : null;
          })
      : null;

  const { data: membershipRows, error: membershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", user.id);

  assertSupabaseResult(membershipError, "Failed to load workspace membership");

  const memberships = (membershipRows ?? []).map(mapMembership);
  const isCanonicalDemoUser =
    isDemoWorkspaceEmail(user.email) && demoConfig.isEnabled;

  if (isCanonicalDemoUser && !demoOrganization) {
    return null;
  }

  const demoMembership = isCanonicalDemoUser
    ? memberships.find(
        (membership) =>
          membership.organizationId === demoOrganization?.id,
      ) ?? null
    : null;

  const membership = isCanonicalDemoUser
    ? demoMembership
    : memberships[0] ?? null;

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
    demo: getWorkspaceDemoState({
      userEmail: user.email,
      organizationSlug: organization.slug,
    }),
  };
}
