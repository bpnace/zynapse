import { cache } from "react";
import { redirect } from "next/navigation";
import { getWorkspaceTypeForRole } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import {
  brandsWorkspaceRoutes,
  creativeWorkspaceRoutes,
  resolveWorkspaceNextPath,
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
    redirect(`/login?next=${encodeURIComponent(brandsWorkspaceRoutes.overview())}`);
  }

  return user;
});

export const requireWorkspaceResolverPath = cache(async () => {
  const user = await requireAuthenticatedUser();

  const membership = await ensureMembershipForCurrentUser(user);

  if (!membership) {
    redirect("/login?error=invite_required");
  }

  const bootstrap = await getWorkspaceBootstrap({
    id: user.id,
    email: user.email,
  });

  if (!bootstrap) {
    const creativeBootstrap = await getCreativeWorkspaceBootstrap({
      id: user.id,
      email: user.email,
    });

    if (!creativeBootstrap) {
      redirect("/login?error=invite_required");
    }

    return creativeWorkspaceRoutes.tasks();
  }

  const defaultMembership = selectDefaultMembership([
    bootstrap.membership,
    ...(membership.id === bootstrap.membership.id ? [] : [membership]),
  ]);

  if (defaultMembership && getWorkspaceTypeForRole(defaultMembership.role) === "creative") {
    return creativeWorkspaceRoutes.tasks();
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
    redirect(`/login?error=invite_required&next=${encodeURIComponent(resolveWorkspaceNextPath(brandsWorkspaceRoutes.overview()))}`);
  }

  await bootstrapWorkspaceForOrganization(bootstrap.organization.id);

  return bootstrap;
});

export const requireCreativeWorkspaceAccess = cache(async () => {
  const user = await requireAuthenticatedUser();

  const ensuredMembership = await ensureMembershipForCurrentUser(user);

  if (!ensuredMembership) {
    redirect(`/login?error=invite_required&next=${encodeURIComponent(creativeWorkspaceRoutes.tasks())}`);
  }

  const bootstrap = await getCreativeWorkspaceBootstrap({
    id: user.id,
    email: user.email,
  });

  if (!bootstrap) {
    redirect(`/login?error=invite_required&next=${encodeURIComponent(creativeWorkspaceRoutes.tasks())}`);
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
