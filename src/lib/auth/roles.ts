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
    canReviewAssets: true,
  },
  brand_reviewer: {
    canManageInvites: false,
    canEditBrandProfile: false,
    canReviewAssets: true,
  },
  zynapse_ops: {
    canManageInvites: true,
    canEditBrandProfile: true,
    canReviewAssets: true,
  },
} as const;
