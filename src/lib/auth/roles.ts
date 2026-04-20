export const legacyWorkspaceRoles = [
  "brand_admin",
  "brand_reviewer",
  "zynapse_ops",
] as const;

export const canonicalWorkspaceRoles = [
  "brand_owner",
  "brand_marketing_lead",
  "brand_reviewer",
  "brand_legal_reviewer",
  "brand_media_buyer",
  "creative",
  "creative_lead",
  "ops",
  "ops_admin",
] as const;

export const workspaceRoles = [
  ...legacyWorkspaceRoles,
  ...canonicalWorkspaceRoles,
] as const;

export const workspaceTypes = ["brand", "creative", "ops"] as const;

export type WorkspaceRole = (typeof workspaceRoles)[number];
export type CanonicalWorkspaceRole = (typeof canonicalWorkspaceRoles)[number];
export type WorkspaceType = (typeof workspaceTypes)[number];

export function isWorkspaceRole(value: string): value is WorkspaceRole {
  return workspaceRoles.includes(value as WorkspaceRole);
}

const workspaceRoleAliases = {
  brand_admin: "brand_owner",
  zynapse_ops: "ops",
} as const satisfies Partial<Record<WorkspaceRole, CanonicalWorkspaceRole>>;

export function normalizeWorkspaceRole(role: WorkspaceRole): CanonicalWorkspaceRole {
  return (
    workspaceRoleAliases[role as keyof typeof workspaceRoleAliases] ??
    (role as CanonicalWorkspaceRole)
  );
}

export const workspaceCapabilities = {
  brand_owner: {
    workspaceType: "brand",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: false,
    canAccessOpsWorkspace: false,
    canManageInvites: false,
    canEditBrandProfile: true,
    canCreateBriefs: true,
    canReviewAssets: true,
    canSubmitPilotRequest: true,
    canSubmitCreativeWork: false,
  },
  brand_marketing_lead: {
    workspaceType: "brand",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: false,
    canAccessOpsWorkspace: false,
    canManageInvites: false,
    canEditBrandProfile: true,
    canCreateBriefs: true,
    canReviewAssets: true,
    canSubmitPilotRequest: true,
    canSubmitCreativeWork: false,
  },
  brand_reviewer: {
    workspaceType: "brand",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: false,
    canAccessOpsWorkspace: false,
    canManageInvites: false,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: true,
    canSubmitPilotRequest: false,
    canSubmitCreativeWork: false,
  },
  brand_legal_reviewer: {
    workspaceType: "brand",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: false,
    canAccessOpsWorkspace: false,
    canManageInvites: false,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: true,
    canSubmitPilotRequest: false,
    canSubmitCreativeWork: false,
  },
  brand_media_buyer: {
    workspaceType: "brand",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: false,
    canAccessOpsWorkspace: false,
    canManageInvites: false,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: true,
    canSubmitPilotRequest: true,
    canSubmitCreativeWork: false,
  },
  creative: {
    workspaceType: "creative",
    canAccessBrandWorkspace: false,
    canAccessCreativeWorkspace: true,
    canAccessOpsWorkspace: false,
    canManageInvites: false,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: false,
    canSubmitPilotRequest: false,
    canSubmitCreativeWork: true,
  },
  creative_lead: {
    workspaceType: "creative",
    canAccessBrandWorkspace: false,
    canAccessCreativeWorkspace: true,
    canAccessOpsWorkspace: false,
    canManageInvites: false,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: false,
    canSubmitPilotRequest: false,
    canSubmitCreativeWork: true,
  },
  ops: {
    workspaceType: "ops",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: true,
    canAccessOpsWorkspace: true,
    canManageInvites: true,
    canEditBrandProfile: true,
    canCreateBriefs: true,
    canReviewAssets: true,
    canSubmitPilotRequest: true,
    canSubmitCreativeWork: true,
  },
  ops_admin: {
    workspaceType: "ops",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: true,
    canAccessOpsWorkspace: true,
    canManageInvites: true,
    canEditBrandProfile: true,
    canCreateBriefs: true,
    canReviewAssets: true,
    canSubmitPilotRequest: true,
    canSubmitCreativeWork: true,
  },
} as const;

export function getWorkspaceCapabilities(
  role: WorkspaceRole,
  options?: { isReadOnly?: boolean },
) {
  const base = workspaceCapabilities[normalizeWorkspaceRole(role)];

  if (!options?.isReadOnly) {
    return base;
  }

  return {
    ...base,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: false,
    canSubmitPilotRequest: false,
    canSubmitCreativeWork: false,
  } as const;
}

export function getWorkspaceTypeForRole(role: WorkspaceRole): WorkspaceType {
  return workspaceCapabilities[normalizeWorkspaceRole(role)].workspaceType;
}
