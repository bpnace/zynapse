import type { WorkspaceType } from "@/lib/auth/roles";
import {
  adminWorkspaceRoutes,
  brandsWorkspaceRoutes,
  creativeWorkspaceRoutes,
  resolveWorkspaceNextPath,
} from "@/lib/workspace/routes";

function getPathnameOnly(pathname: string) {
  return pathname.split(/[?#]/, 1)[0] ?? pathname;
}

export function isOpsWorkspacePath(pathname: string) {
  const safePathname = getPathnameOnly(pathname);
  return safePathname === "/ops" || safePathname.startsWith("/ops/");
}

export function isAdminWorkspacePath(pathname: string) {
  const safePathname = getPathnameOnly(pathname);
  return safePathname === "/admin" || safePathname.startsWith("/admin/");
}

export function getWorkspaceLandingPath(workspaceType: WorkspaceType) {
  if (workspaceType === "creative") {
    return creativeWorkspaceRoutes.home();
  }

  if (workspaceType === "ops") {
    // Ops remains the backend/internal orchestration layer; Admin is the
    // canonical human-facing UI for internal intervention and exception handling.
    return adminWorkspaceRoutes.requests();
  }

  return brandsWorkspaceRoutes.home();
}

export function resolveProtectedWorkspaceNextPath(
  next: string | null | undefined,
  fallback = "/app",
) {
  const candidate = next?.trim() ?? "";

  if (
    candidate &&
    !candidate.startsWith("//") &&
    (isOpsWorkspacePath(candidate) || isAdminWorkspacePath(candidate))
  ) {
    return candidate;
  }

  return resolveWorkspaceNextPath(candidate, fallback);
}
