import {
  getWorkspaceTypeForRole,
  type WorkspaceRole,
  type WorkspaceType,
} from "@/lib/auth/roles";

export type WorkspaceMembershipLike = {
  id: string;
  organizationId: string;
  userId: string;
  role: WorkspaceRole;
  workspaceType?: WorkspaceType | null;
  acceptedAt: Date;
};

function getMembershipWorkspaceType(membership: WorkspaceMembershipLike): WorkspaceType {
  return membership.workspaceType ?? getWorkspaceTypeForRole(membership.role);
}

const workspaceTypePriority: Record<WorkspaceType, number> = {
  brand: 0,
  creative: 1,
  ops: 2,
};

export function sortMembershipsByRecency(
  memberships: WorkspaceMembershipLike[],
) {
  return [...memberships].sort(
    (left, right) => right.acceptedAt.getTime() - left.acceptedAt.getTime(),
  );
}

export function selectMembershipForWorkspace(
  memberships: WorkspaceMembershipLike[],
  workspaceType: WorkspaceType,
) {
  return sortMembershipsByRecency(memberships).find(
    (membership) => getMembershipWorkspaceType(membership) === workspaceType,
  ) ?? null;
}

export function selectDefaultMembership(
  memberships: WorkspaceMembershipLike[],
) {
  return [...sortMembershipsByRecency(memberships)].sort((left, right) => {
    const typeDiff =
      workspaceTypePriority[getMembershipWorkspaceType(left)] -
      workspaceTypePriority[getMembershipWorkspaceType(right)];

    if (typeDiff !== 0) {
      return typeDiff;
    }

    return right.acceptedAt.getTime() - left.acceptedAt.getTime();
  })[0] ?? null;
}
