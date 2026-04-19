import { resolveWorkspaceNextPath } from "@/lib/workspace/routes";

const DEFAULT_DEMO_WORKSPACE_EMAIL = "demo@zynapse.eu";
const DEFAULT_DEMO_WORKSPACE_ORGANIZATION_SLUG = "zynapse-closed-demo";
const DEMO_LOGIN_ROUTE = "/demo-login";

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
    organizationSlug: readDemoEnv(
      "DEMO_WORKSPACE_ORGANIZATION_SLUG",
      DEFAULT_DEMO_WORKSPACE_ORGANIZATION_SLUG,
    ),
    loginRoute: DEMO_LOGIN_ROUTE,
    isEnabled: readDemoEnv("DEMO_WORKSPACE_LOGIN_ENABLED", "false") === "true",
  } as const;
}

export function isDemoWorkspaceEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return (
    email.trim().toLowerCase() === getDemoWorkspaceConfig().canonicalEmail
  );
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
  return resolveWorkspaceNextPath(next, "/workspace");
}
