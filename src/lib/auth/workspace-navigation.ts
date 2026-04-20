import type { WorkspaceType } from "@/lib/auth/roles";
import { resolveWorkspaceNextPath } from "@/lib/workspace/routes";

function getPathnameOnly(pathname: string) {
  return pathname.split(/[?#]/, 1)[0] ?? pathname;
}

export function isOpsWorkspacePath(pathname: string) {
  const safePathname = getPathnameOnly(pathname);
  return safePathname === "/ops" || safePathname.startsWith("/ops/");
}

export function getWorkspaceLandingPath(workspaceType: WorkspaceType) {
  if (workspaceType === "creative") {
    return "/creatives/tasks";
  }

  if (workspaceType === "ops") {
    return "/ops";
  }

  return "/brands/today";
}

export function resolveProtectedWorkspaceNextPath(
  next: string | null | undefined,
  fallback = "/app",
) {
  const candidate = next?.trim() ?? "";

  if (candidate && !candidate.startsWith("//") && isOpsWorkspacePath(candidate)) {
    return candidate;
  }

  return resolveWorkspaceNextPath(candidate, fallback);
}
