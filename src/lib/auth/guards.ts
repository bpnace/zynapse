import { cache } from "react";
import { redirect } from "next/navigation";
import { getWorkspaceTypeForRole } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import {
  getWorkspaceLandingPath,
  resolveProtectedWorkspaceNextPath,
} from "@/lib/auth/workspace-navigation";
import {
  brandsWorkspaceRoutes,
  creativeWorkspaceRoutes,
  opsWorkspaceRoutes,
} from "@/lib/workspace/routes";
import { ensureMembershipForCurrentUser } from "@/lib/workspace/services/accept-invite";
import {
  getCreativeWorkspaceBootstrap,
  getWorkspaceBootstrap,
} from "@/lib/workspace/queries/get-workspace-bootstrap";
import { bootstrapWorkspaceForOrganization } from "@/lib/workspace/seeds/bootstrap-workspace";
import { bootstrapCreativeWorkspaceForUser } from "@/lib/workspace/seeds/bootstrap-creative-workspace";
import { selectDefaultMembership } from "@/lib/workspace/membership-selection";

export const requireAuthenticatedUser = cache(async () => {
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(getWorkspaceLandingPath("brand"))}`);
  }

  return user;
});

export const requireWorkspaceResolverPath = cache(async () => {
  const user = await requireAuthenticatedUser();

  const membership = await ensureMembershipForCurrentUser(user);

  if (!membership) {
    redirect("/login?error=invite_required");
  }

  const [brandBootstrap, creativeBootstrap, opsBootstrap] = await Promise.all([
    getWorkspaceBootstrap({
      id: user.id,
      email: user.email,
    }),
    getCreativeWorkspaceBootstrap({
      id: user.id,
      email: user.email,
    }),
    getWorkspaceBootstrap(
      {
        id: user.id,
        email: user.email,
      },
      {
        workspaceType: "ops",
      },
    ),
  ]);

  if (!brandBootstrap && !creativeBootstrap && !opsBootstrap) {
    redirect("/login?error=invite_required");
  }

  const candidateMemberships = [
    brandBootstrap?.membership,
    creativeBootstrap?.membership,
    opsBootstrap?.membership,
    membership,
  ].filter((value, index, items): value is NonNullable<typeof value> => {
    if (!value) {
      return false;
    }

    return items.findIndex((candidate) => candidate?.id === value.id) === index;
  });

  const defaultMembership = selectDefaultMembership(candidateMemberships);

  if (!defaultMembership) {
    if (creativeBootstrap) {
      return creativeWorkspaceRoutes.tasks();
    }

    if (opsBootstrap) {
      return opsWorkspaceRoutes.overview();
    }

    return brandsWorkspaceRoutes.overview();
  }

  const workspaceType = getWorkspaceTypeForRole(defaultMembership.role);

  if (workspaceType === "creative") {
    return creativeWorkspaceRoutes.tasks();
  }

  if (workspaceType === "ops") {
    return opsWorkspaceRoutes.overview();
  }

  return brandsWorkspaceRoutes.overview();
});

export const requireWorkspaceAccess = cache(async () => {
  const user = await requireAuthenticatedUser();

  await ensureMembershipForCurrentUser(user);

  const bootstrap = await getWorkspaceBootstrap(
    {
      id: user.id,
      email: user.email,
    },
    {
      workspaceType: "brand",
    },
  );

  if (!bootstrap) {
    redirect(
      `/login?error=invite_required&next=${encodeURIComponent(
        resolveProtectedWorkspaceNextPath(brandsWorkspaceRoutes.overview()),
      )}`,
    );
  }

  await bootstrapWorkspaceForOrganization(bootstrap.organization.id);

  return bootstrap;
});

export const requireCreativeWorkspaceAccess = cache(async () => {
  const user = await requireAuthenticatedUser();

  const ensuredMembership = await ensureMembershipForCurrentUser(user);

  if (!ensuredMembership) {
    redirect(
      `/login?error=invite_required&next=${encodeURIComponent(
        getWorkspaceLandingPath("creative"),
      )}`,
    );
  }

  const bootstrap = await getCreativeWorkspaceBootstrap({
    id: user.id,
    email: user.email,
  });

  if (!bootstrap) {
    redirect(
      `/login?error=invite_required&next=${encodeURIComponent(
        getWorkspaceLandingPath("creative"),
      )}`,
    );
  }

  await bootstrapWorkspaceForOrganization(bootstrap.organization.id);
  await bootstrapCreativeWorkspaceForUser({
    organizationId: bootstrap.organization.id,
    userId: bootstrap.membership.userId,
    userEmail: user.email,
    role: bootstrap.membership.role,
  });

  return bootstrap;
});

export const requireOpsWorkspaceAccess = cache(async () => {
  const user = await requireAuthenticatedUser();

  await ensureMembershipForCurrentUser(user);

  const bootstrap = await getWorkspaceBootstrap(
    {
      id: user.id,
      email: user.email,
    },
    {
      workspaceType: "ops",
    },
  );

  if (!bootstrap) {
    redirect(
      `/login?error=invite_required&next=${encodeURIComponent(
        getWorkspaceLandingPath("ops"),
      )}`,
    );
  }

  await bootstrapWorkspaceForOrganization(bootstrap.organization.id);

  return bootstrap;
});
