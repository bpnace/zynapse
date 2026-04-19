export type BrandsWorkspaceNamespace = "workspace" | "brands";

const DEFAULT_NAMESPACE: BrandsWorkspaceNamespace = "workspace";
const KNOWN_BRAND_NAMESPACES: BrandsWorkspaceNamespace[] = ["workspace", "brands"];

function getPathnameOnly(pathname: string) {
  return pathname.split(/[?#]/, 1)[0] ?? pathname;
}

function getBrandBasePath(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
  return `/${namespace}`;
}

export const creativeWorkspaceRoutes = {
  landing() {
    return "/app";
  },
  tasks() {
    return "/creatives/tasks";
  },
  feedback() {
    return "/creatives/feedback";
  },
  campaigns: {
    detail(campaignId: string) {
      return `/creatives/campaigns/${campaignId}`;
    },
  },
};

export const brandsWorkspaceRoutes = {
  overview(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    return getBrandBasePath(namespace);
  },
  onboarding(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    return `${getBrandBasePath(namespace)}/onboarding`;
  },
  briefs: {
    new(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBrandBasePath(namespace)}/briefs/new`;
    },
    detail(briefId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBrandBasePath(namespace)}/briefs/${briefId}`;
    },
  },
  campaigns: {
    detail(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBrandBasePath(namespace)}/campaigns/${campaignId}`;
    },
    review(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBrandBasePath(namespace)}/campaigns/${campaignId}/review`;
    },
    handover(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBrandBasePath(namespace)}/campaigns/${campaignId}/handover`;
    },
  },
  pilotRequest(
    options: {
      campaignId?: string | null;
      namespace?: BrandsWorkspaceNamespace;
    } = {},
  ) {
    const namespace = options.namespace ?? DEFAULT_NAMESPACE;
    const searchParams = new URLSearchParams();

    if (options.campaignId) {
      searchParams.set("campaignId", options.campaignId);
    }

    const query = searchParams.toString();
    return query
      ? `${getBrandBasePath(namespace)}/pilot-request?${query}`
      : `${getBrandBasePath(namespace)}/pilot-request`;
  },
  revalidation(options: {
    campaignId?: string | null;
    briefId?: string | null;
    namespace?: BrandsWorkspaceNamespace;
  } = {}) {
    const namespace = options.namespace ?? DEFAULT_NAMESPACE;
    const paths = [
      brandsWorkspaceRoutes.overview(namespace),
      brandsWorkspaceRoutes.onboarding(namespace),
      brandsWorkspaceRoutes.briefs.new(namespace),
      `${getBrandBasePath(namespace)}/pilot-request`,
    ];

    if (options.briefId) {
      paths.push(brandsWorkspaceRoutes.briefs.detail(options.briefId, namespace));
    }

    if (options.campaignId) {
      paths.push(brandsWorkspaceRoutes.campaigns.detail(options.campaignId, namespace));
      paths.push(brandsWorkspaceRoutes.campaigns.review(options.campaignId, namespace));
      paths.push(brandsWorkspaceRoutes.campaigns.handover(options.campaignId, namespace));
    }

    return [...new Set(paths)];
  },
  isKnownPath(pathname: string) {
    const safePathname = getPathnameOnly(pathname);
    return KNOWN_BRAND_NAMESPACES.some((namespace) => {
      const prefix = getBrandBasePath(namespace);
      return safePathname === prefix || safePathname.startsWith(`${prefix}/`);
    });
  },
  resolveNextPath(
    next: string | null | undefined,
    namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE,
  ) {
    return resolveWorkspaceNextPath(next, brandsWorkspaceRoutes.overview(namespace));
  },
};

export function isProtectedWorkspacePath(pathname: string) {
  const safePathname = getPathnameOnly(pathname);

  if (safePathname === creativeWorkspaceRoutes.landing()) {
    return true;
  }

  if (
    safePathname === brandsWorkspaceRoutes.overview() ||
    safePathname.startsWith(`${brandsWorkspaceRoutes.overview()}/`)
  ) {
    return true;
  }

  return (
    safePathname === creativeWorkspaceRoutes.tasks() ||
    safePathname === creativeWorkspaceRoutes.feedback() ||
    safePathname.startsWith("/creatives/campaigns/")
  );
}

export function resolveWorkspaceNextPath(
  next: string | null | undefined,
  fallback: string = brandsWorkspaceRoutes.overview(),
) {
  const candidate = next?.trim() ?? "";

  if (
    candidate &&
    !candidate.startsWith("//") &&
    (isProtectedWorkspacePath(candidate) || brandsWorkspaceRoutes.isKnownPath(candidate))
  ) {
    return candidate;
  }

  return fallback;
}
