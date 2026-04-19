export type BrandsWorkspaceNamespace = "workspace" | "brands";

const DEFAULT_NAMESPACE: BrandsWorkspaceNamespace = "workspace";
const KNOWN_NAMESPACES: BrandsWorkspaceNamespace[] = ["workspace", "brands"];

function getNamespace(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
  return namespace;
}

function getBasePath(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
  return `/${getNamespace(namespace)}`;
}

function getPathnameOnly(pathname: string) {
  return pathname.split(/[?#]/, 1)[0] ?? pathname;
}

export const brandsWorkspaceRoutes = {
  overview(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    return getBasePath(namespace);
  },
  onboarding(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    return `${getBasePath(namespace)}/onboarding`;
  },
  briefs: {
    new(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBasePath(namespace)}/briefs/new`;
    },
    detail(briefId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBasePath(namespace)}/briefs/${briefId}`;
    },
  },
  campaigns: {
    detail(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBasePath(namespace)}/campaigns/${campaignId}`;
    },
    review(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBasePath(namespace)}/campaigns/${campaignId}/review`;
    },
    handover(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return `${getBasePath(namespace)}/campaigns/${campaignId}/handover`;
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
      ? `${getBasePath(namespace)}/pilot-request?${query}`
      : `${getBasePath(namespace)}/pilot-request`;
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
      `${getBasePath(namespace)}/pilot-request`,
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
    return KNOWN_NAMESPACES.some((namespace) => {
      const prefix = getBasePath(namespace);
      return safePathname === prefix || safePathname.startsWith(`${prefix}/`);
    });
  },
  resolveNextPath(
    next: string | null | undefined,
    namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE,
  ) {
    const candidate = next?.trim() ?? "";

    if (
      candidate &&
      !candidate.startsWith("//") &&
      brandsWorkspaceRoutes.isKnownPath(candidate)
    ) {
      return candidate;
    }

    return brandsWorkspaceRoutes.overview(namespace);
  },
};
