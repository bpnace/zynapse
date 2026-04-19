export const workspaceRoles = [
  "brand_admin",
  "brand_reviewer",
  "creative",
  "creative_lead",
  "zynapse_ops",
] as const;

export const workspaceTypes = ["brand", "creative", "ops"] as const;

export type WorkspaceRole = (typeof workspaceRoles)[number];
export type WorkspaceType = (typeof workspaceTypes)[number];

export function isWorkspaceRole(value: string): value is WorkspaceRole {
  return workspaceRoles.includes(value as WorkspaceRole);
}

export const workspaceCapabilities = {
  brand_admin: {
    workspaceType: "brand",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: false,
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
    canManageInvites: false,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: true,
    canSubmitPilotRequest: false,
    canSubmitCreativeWork: false,
  },
  creative: {
    workspaceType: "creative",
    canAccessBrandWorkspace: false,
    canAccessCreativeWorkspace: true,
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
    canManageInvites: false,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: false,
    canSubmitPilotRequest: false,
    canSubmitCreativeWork: true,
  },
  zynapse_ops: {
    workspaceType: "ops",
    canAccessBrandWorkspace: true,
    canAccessCreativeWorkspace: true,
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
  const base = workspaceCapabilities[role];

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
  return workspaceCapabilities[role].workspaceType;
}
