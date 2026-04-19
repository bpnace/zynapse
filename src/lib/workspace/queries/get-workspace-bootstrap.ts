import {
  assertSupabaseResult,
  mapCreativeProfile,
  mapBrandProfile,
  mapMembership,
  mapOrganization,
  requireServiceRoleClient,
} from "@/lib/workspace/data/service-role";
import { selectDefaultMembership, selectMembershipForWorkspace } from "@/lib/workspace/membership-selection";
import {
  getDemoWorkspaceConfig,
  getWorkspaceDemoState,
  isDemoWorkspaceEmail,
} from "@/lib/workspace/demo";
import type { WorkspaceType } from "@/lib/auth/roles";

type WorkspaceBootstrapUser = {
  id: string;
  email?: string | null;
};

type GetWorkspaceBootstrapOptions = {
  workspaceType?: WorkspaceType;
};

async function getWorkspaceMemberships(user: WorkspaceBootstrapUser) {
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
    return {
      memberships: [],
      demoOrganization: null,
      isCanonicalDemoUser,
    };
  }

  return {
    memberships,
    demoOrganization,
    isCanonicalDemoUser,
  };
}

async function getOrganizationContext(membership: {
  organizationId: string;
}) {
  const supabase = requireServiceRoleClient();

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

  return organization;
}

export async function getWorkspaceBootstrap(
  user: WorkspaceBootstrapUser,
  options: GetWorkspaceBootstrapOptions = {},
) {
  const { memberships, demoOrganization, isCanonicalDemoUser } =
    await getWorkspaceMemberships(user);

  const demoMembership = isCanonicalDemoUser
    ? memberships.find((membership) => membership.organizationId === demoOrganization?.id) ?? null
    : null;

  const membership = isCanonicalDemoUser
    ? demoMembership
    : options.workspaceType
      ? selectMembershipForWorkspace(memberships, options.workspaceType)
      : selectDefaultMembership(memberships);

  if (!membership) {
    return null;
  }

  const organization = await getOrganizationContext(membership);

  if (!organization) {
    return null;
  }

  const supabase = requireServiceRoleClient();

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

export async function getCreativeWorkspaceBootstrap(user: WorkspaceBootstrapUser) {
  const { memberships, demoOrganization, isCanonicalDemoUser } =
    await getWorkspaceMemberships(user);

  const demoMembership = isCanonicalDemoUser
    ? memberships.find((membership) => membership.organizationId === demoOrganization?.id) ?? null
    : null;

  const membership = isCanonicalDemoUser
    ? demoMembership
    : selectMembershipForWorkspace(memberships, "creative");

  if (!membership) {
    return null;
  }

  const organization = await getOrganizationContext(membership);

  if (!organization) {
    return null;
  }

  const supabase = requireServiceRoleClient();
  const { data: creativeProfileRow, error: creativeProfileError } = await supabase
    .from("creative_profiles")
    .select("*")
    .eq("user_id", membership.userId)
    .limit(1)
    .maybeSingle();

  assertSupabaseResult(creativeProfileError, "Failed to load creative profile");

  const creativeProfile = creativeProfileRow ? mapCreativeProfile(creativeProfileRow) : null;

  return {
    membership,
    organization,
    creativeProfile,
    demo: getWorkspaceDemoState({
      userEmail: user.email,
      organizationSlug: organization.slug,
    }),
  };
}
