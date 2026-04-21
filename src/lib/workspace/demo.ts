import { getWorkspaceLandingPath } from "@/lib/auth/workspace-navigation";
import {
  brandsWorkspaceRoutes,
  creativeWorkspaceRoutes,
  resolveWorkspaceNextPath,
} from "@/lib/workspace/routes";

const DEFAULT_DEMO_WORKSPACE_EMAIL = "demo@zynapse.eu";
const DEFAULT_DEMO_WORKSPACE_ORGANIZATION_SLUG = "zynapse-closed-demo";
const DEMO_LOGIN_ROUTE = "/demo-login";

function deriveSiblingEmail(baseEmail: string, suffix: string) {
  const normalizedEmail = baseEmail.trim().toLowerCase();
  const [localPart, domain] = normalizedEmail.split("@");

  if (!localPart || !domain) {
    return normalizedEmail;
  }

  return `${localPart}+${suffix}@${domain}`;
}

function readDemoEnv(key: string, fallback: string) {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export type WorkspaceDemoState = {
  canonicalEmail: string;
  organizationSlug: string;
  loginRoute: string;
  isEnabled: boolean;
  isDemoWorkspace: boolean;
  isReadOnly: boolean;
  shellBadge: string;
  shellDescription: string;
  mutationMessage: string;
};

export function getDemoWorkspaceConfig() {
  const canonicalEmail = readDemoEnv(
    "DEMO_WORKSPACE_EMAIL",
    readDemoEnv("E2E_WORKSPACE_EMAIL", DEFAULT_DEMO_WORKSPACE_EMAIL),
  );

  return {
    canonicalEmail: canonicalEmail.toLowerCase(),
    creativeEmail: readDemoEnv(
      "DEMO_WORKSPACE_CREATIVE_EMAIL",
      deriveSiblingEmail(canonicalEmail, "creative"),
    ).toLowerCase(),
    organizationSlug: readDemoEnv(
      "DEMO_WORKSPACE_ORGANIZATION_SLUG",
      DEFAULT_DEMO_WORKSPACE_ORGANIZATION_SLUG,
    ),
    loginRoute: DEMO_LOGIN_ROUTE,
    isEnabled: readDemoEnv("DEMO_WORKSPACE_LOGIN_ENABLED", "false") === "true",
  } as const;
}

export function getDemoWorkspaceTypeForEmail(
  email: string | null | undefined,
) {
  if (!email) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const config = getDemoWorkspaceConfig();

  if (normalizedEmail === config.canonicalEmail) {
    return "brand" as const;
  }

  if (normalizedEmail === config.creativeEmail) {
    return "creative" as const;
  }

  return null;
}

export function isPrimaryDemoWorkspaceEmail(email: string | null | undefined) {
  return getDemoWorkspaceTypeForEmail(email) === "brand";
}

export function isDemoWorkspaceEmail(email: string | null | undefined) {
  return getDemoWorkspaceTypeForEmail(email) !== null;
}

export function getWorkspaceDemoState(input: {
  userEmail?: string | null;
  organizationSlug?: string | null;
}) {
  const config = getDemoWorkspaceConfig();
  const matchesCanonicalEmail = isDemoWorkspaceEmail(input.userEmail);
  const matchesCanonicalOrganization =
    input.organizationSlug === config.organizationSlug;
  const isDemoWorkspace = matchesCanonicalEmail || matchesCanonicalOrganization;

  return {
    canonicalEmail: config.canonicalEmail,
    organizationSlug: config.organizationSlug,
    loginRoute: config.loginRoute,
    isEnabled: config.isEnabled,
    isDemoWorkspace,
    isReadOnly: isDemoWorkspace,
    shellBadge: "Geschlossene Demo",
    shellDescription:
      "Diese Demo ist bewusst schreibgeschützt. Inhalte, Status und Outputs werden für Demos zurückgesetzt.",
    mutationMessage:
      "Diese geschlossene Demo ist schreibgeschützt. Inhalte können angesehen, aber nicht dauerhaft verändert werden.",
  } satisfies WorkspaceDemoState;
}

export function resolveDemoWorkspaceNextPath(next: string | null | undefined) {
  return resolveWorkspaceNextPath(next, getWorkspaceLandingPath("brand"));
}

export function resolveDemoWorkspaceNextPathForEmail(
  email: string | null | undefined,
  next: string | null | undefined,
) {
  const workspaceType = getDemoWorkspaceTypeForEmail(email) ?? "brand";
  const resolvedNext = resolveWorkspaceNextPath(next, getWorkspaceLandingPath(workspaceType));

  if (workspaceType === "creative") {
    if (
      resolvedNext === creativeWorkspaceRoutes.landing() ||
      resolvedNext === creativeWorkspaceRoutes.home() ||
      resolvedNext === creativeWorkspaceRoutes.tasks() ||
      resolvedNext === creativeWorkspaceRoutes.feedback() ||
      resolvedNext === creativeWorkspaceRoutes.invitations.index() ||
      resolvedNext === creativeWorkspaceRoutes.revisions.index() ||
      resolvedNext === creativeWorkspaceRoutes.profile() ||
      resolvedNext === creativeWorkspaceRoutes.availability() ||
      resolvedNext === creativeWorkspaceRoutes.resources() ||
      resolvedNext === creativeWorkspaceRoutes.payouts() ||
      resolvedNext === creativeWorkspaceRoutes.campaigns.index() ||
      resolvedNext.startsWith("/creatives/tasks/") ||
      resolvedNext.startsWith("/creatives/invitations/") ||
      resolvedNext.startsWith("/creatives/revisions/") ||
      resolvedNext.startsWith("/creatives/campaigns/")
    ) {
      return resolvedNext;
    }

    return getWorkspaceLandingPath("creative");
  }

  if (brandsWorkspaceRoutes.isKnownPath(resolvedNext)) {
    return resolvedNext;
  }

  return getWorkspaceLandingPath("brand");
}
