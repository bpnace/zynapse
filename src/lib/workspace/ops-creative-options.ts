import type {
  mapCreativeProfile,
  mapMembership,
} from "@/lib/workspace/data/service-role";

export type OpsCreativeOption = {
  userId: string;
  displayName: string;
  role: string;
  membershipStatus: string;
};

export function deriveOpsCreativeOptions(input: {
  memberships: ReturnType<typeof mapMembership>[];
  creativeProfiles: ReturnType<typeof mapCreativeProfile>[];
}) {
  const profileByUserId = new Map(
    input.creativeProfiles.map((profile) => [profile.userId, profile]),
  );

  return input.memberships
    .filter(
      (membership) =>
        membership.workspaceType === "creative" &&
        membership.membershipStatus === "active",
    )
    .reduce<OpsCreativeOption[]>((options, membership) => {
      if (options.some((option) => option.userId === membership.userId)) {
        return options;
      }

      const profile = profileByUserId.get(membership.userId);

      options.push({
        userId: membership.userId,
        displayName: profile?.displayName ?? membership.userId,
        role: membership.role,
        membershipStatus: membership.membershipStatus,
      });

      return options;
    }, [])
    .sort((left, right) => left.displayName.localeCompare(right.displayName));
}
