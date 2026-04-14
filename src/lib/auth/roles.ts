export const workspaceRoles = [
  "brand_admin",
  "brand_reviewer",
  "zynapse_ops",
] as const;

export type WorkspaceRole = (typeof workspaceRoles)[number];

export function isWorkspaceRole(value: string): value is WorkspaceRole {
  return workspaceRoles.includes(value as WorkspaceRole);
}

export const workspaceCapabilities = {
  brand_admin: {
    canManageInvites: false,
    canEditBrandProfile: true,
    canCreateBriefs: true,
    canReviewAssets: true,
    canSubmitPilotRequest: true,
  },
  brand_reviewer: {
    canManageInvites: false,
    canEditBrandProfile: false,
    canCreateBriefs: false,
    canReviewAssets: true,
    canSubmitPilotRequest: false,
  },
  zynapse_ops: {
    canManageInvites: true,
    canEditBrandProfile: true,
    canCreateBriefs: true,
    canReviewAssets: true,
    canSubmitPilotRequest: true,
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
  } as const;
}
