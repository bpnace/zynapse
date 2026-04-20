export type BrandsWorkspaceNamespace = "workspace" | "brands";

const DEFAULT_NAMESPACE: BrandsWorkspaceNamespace = "brands";
const BRAND_NAMESPACES: BrandsWorkspaceNamespace[] = ["workspace", "brands"];

function getPathnameOnly(pathname: string) {
  return pathname.split(/[?#]/, 1)[0] ?? pathname;
}

function getBrandBasePath(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
  return `/${namespace}`;
}

function getBrandOverviewPath(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
  return namespace === "brands" ? "/brands/today" : "/workspace";
}

function buildBrandPath(
  suffix: string,
  namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE,
) {
  return namespace === "workspace"
    ? `${getBrandBasePath(namespace)}${suffix}`
    : `${getBrandBasePath(namespace)}${suffix}`;
}

function getBrandProtectedPrefixes(namespace: BrandsWorkspaceNamespace) {
  return [
    getBrandOverviewPath(namespace),
    buildBrandPath("/onboarding", namespace),
    buildBrandPath("/briefs", namespace),
    buildBrandPath("/campaigns", namespace),
    buildBrandPath("/pilot-request", namespace),
  ];
}

function isBrandProtectedPathForNamespace(
  pathname: string,
  namespace: BrandsWorkspaceNamespace,
) {
  const safePathname = getPathnameOnly(pathname);
  return getBrandProtectedPrefixes(namespace).some((prefix) => {
    if (safePathname === prefix) {
      return true;
    }

    return safePathname.startsWith(`${prefix}/`);
  });
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
    return getBrandOverviewPath(namespace);
  },
  onboarding(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    return buildBrandPath("/onboarding", namespace);
  },
  briefs: {
    new(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return buildBrandPath("/briefs/new", namespace);
    },
    detail(briefId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return buildBrandPath(`/briefs/${briefId}`, namespace);
    },
  },
  campaigns: {
    detail(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return buildBrandPath(`/campaigns/${campaignId}`, namespace);
    },
    review(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return buildBrandPath(`/campaigns/${campaignId}/review`, namespace);
    },
    handover(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      return buildBrandPath(`/campaigns/${campaignId}/handover`, namespace);
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
      ? `${buildBrandPath("/pilot-request", namespace)}?${query}`
      : buildBrandPath("/pilot-request", namespace);
  },
  revalidation(options: {
    campaignId?: string | null;
    briefId?: string | null;
    namespace?: BrandsWorkspaceNamespace;
  } = {}) {
    const namespaces = options.namespace ? [options.namespace] : BRAND_NAMESPACES;
    return [
      ...new Set(
        namespaces.flatMap((namespace) => {
          const paths = [
            brandsWorkspaceRoutes.overview(namespace),
            brandsWorkspaceRoutes.onboarding(namespace),
            brandsWorkspaceRoutes.briefs.new(namespace),
            buildBrandPath("/pilot-request", namespace),
          ];

          if (options.briefId) {
            paths.push(brandsWorkspaceRoutes.briefs.detail(options.briefId, namespace));
          }

          if (options.campaignId) {
            paths.push(brandsWorkspaceRoutes.campaigns.detail(options.campaignId, namespace));
            paths.push(brandsWorkspaceRoutes.campaigns.review(options.campaignId, namespace));
            paths.push(brandsWorkspaceRoutes.campaigns.handover(options.campaignId, namespace));
          }

          return paths;
        }),
      ),
    ];
  },
  isKnownPath(pathname: string) {
    return BRAND_NAMESPACES.some((namespace) =>
      isBrandProtectedPathForNamespace(pathname, namespace),
    );
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

  if (brandsWorkspaceRoutes.isKnownPath(safePathname)) {
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
