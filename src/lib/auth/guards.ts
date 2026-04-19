import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";
import { ensureMembershipForCurrentUser } from "@/lib/workspace/services/accept-invite";
import { getWorkspaceBootstrap } from "@/lib/workspace/queries/get-workspace-bootstrap";
import { bootstrapWorkspaceForOrganization } from "@/lib/workspace/seeds/bootstrap-workspace";

export const requireAuthenticatedUser = cache(async () => {
  const user = await getSessionUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(brandsWorkspaceRoutes.overview())}`);
  }

  return user;
});

export const requireWorkspaceAccess = cache(async () => {
  const user = await requireAuthenticatedUser();

  const membership = await ensureMembershipForCurrentUser(user);

  if (!membership) {
    redirect("/login?error=invite_required");
  }

  await bootstrapWorkspaceForOrganization(membership.organizationId);

  const bootstrap = await getWorkspaceBootstrap({
    id: user.id,
    email: user.email,
  });

  if (!bootstrap) {
    redirect("/login?error=invite_required");
  }

  return bootstrap;
});
