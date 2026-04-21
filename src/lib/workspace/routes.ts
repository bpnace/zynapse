export type BrandsWorkspaceNamespace = "brands";

const DEFAULT_NAMESPACE: BrandsWorkspaceNamespace = "brands";

function getPathnameOnly(pathname: string) {
  return pathname.split(/[?#]/, 1)[0] ?? pathname;
}

function getBrandBasePath() {
  return "/brands";
}

function buildBrandPath(
  suffix: string,
) {
  return `${getBrandBasePath()}${suffix}`;
}

function getBrandProtectedPrefixes() {
  return [
    "/brands/today",
    buildBrandPath("/onboarding"),
    buildBrandPath("/briefs"),
    buildBrandPath("/campaigns"),
    buildBrandPath("/pilot-request"),
  ];
}

function isBrandProtectedPath(pathname: string) {
  const safePathname = getPathnameOnly(pathname);
  return getBrandProtectedPrefixes().some((prefix) => {
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
    index() {
      return "/creatives/campaigns";
    },
    detail(campaignId: string) {
      return `/creatives/campaigns/${campaignId}`;
    },
  },
};

export const opsWorkspaceRoutes = {
  overview() {
    return "/ops";
  },
  campaigns() {
    return "/ops/campaigns";
  },
  campaignDetail(campaignId: string) {
    return `/ops/campaigns/${campaignId}`;
  },
  assignments() {
    return "/ops/assignments";
  },
  delivery() {
    return "/ops/delivery";
  },
  commercial() {
    return "/ops/commercial";
  },
  legacyReviewReadiness() {
    return "/ops/review-readiness";
  },
  legacyCommercialHandoffs() {
    return "/ops/commercial-handoffs";
  },
  isKnownPath(pathname: string) {
    const safePathname = getPathnameOnly(pathname);
    const prefixes = [
      opsWorkspaceRoutes.overview(),
      opsWorkspaceRoutes.campaigns(),
      opsWorkspaceRoutes.assignments(),
      opsWorkspaceRoutes.delivery(),
      opsWorkspaceRoutes.commercial(),
      opsWorkspaceRoutes.legacyReviewReadiness(),
      opsWorkspaceRoutes.legacyCommercialHandoffs(),
    ];

    return prefixes.some((prefix) => {
      if (safePathname === prefix) {
        return true;
      }

      return safePathname.startsWith(`${prefix}/`);
    });
  },
};

export const brandsWorkspaceRoutes = {
  overview(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return "/brands/today";
  },
  onboarding(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return buildBrandPath("/onboarding");
  },
  briefs: {
    new(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath("/briefs/new");
    },
    detail(briefId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath(`/briefs/${briefId}`);
    },
  },
  campaigns: {
    detail(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath(`/campaigns/${campaignId}`);
    },
    review(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath(`/campaigns/${campaignId}/review`);
    },
    handover(campaignId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath(`/campaigns/${campaignId}/handover`);
    },
  },
  pilotRequest(
    options: {
      campaignId?: string | null;
      namespace?: BrandsWorkspaceNamespace;
    } = {},
  ) {
    const searchParams = new URLSearchParams();

    if (options.campaignId) {
      searchParams.set("campaignId", options.campaignId);
    }

    const query = searchParams.toString();
    return query
      ? `${buildBrandPath("/pilot-request")}?${query}`
      : buildBrandPath("/pilot-request");
  },
  revalidation(options: {
    campaignId?: string | null;
    briefId?: string | null;
    namespace?: BrandsWorkspaceNamespace;
  } = {}) {
    return [
      ...new Set(
        (() => {
          const paths = [
            brandsWorkspaceRoutes.overview(),
            brandsWorkspaceRoutes.onboarding(),
            brandsWorkspaceRoutes.briefs.new(),
            buildBrandPath("/pilot-request"),
          ];

          if (options.briefId) {
            paths.push(brandsWorkspaceRoutes.briefs.detail(options.briefId));
          }

          if (options.campaignId) {
            paths.push(brandsWorkspaceRoutes.campaigns.detail(options.campaignId));
            paths.push(brandsWorkspaceRoutes.campaigns.review(options.campaignId));
            paths.push(brandsWorkspaceRoutes.campaigns.handover(options.campaignId));
          }

          return paths;
        })(),
      ),
    ];
  },
  isKnownPath(pathname: string) {
    return isBrandProtectedPath(pathname);
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

  if (opsWorkspaceRoutes.isKnownPath(safePathname)) {
    return true;
  }

  return (
    safePathname === creativeWorkspaceRoutes.tasks() ||
    safePathname === creativeWorkspaceRoutes.feedback() ||
    safePathname === creativeWorkspaceRoutes.campaigns.index() ||
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
    (isProtectedWorkspacePath(candidate) ||
      brandsWorkspaceRoutes.isKnownPath(candidate) ||
      opsWorkspaceRoutes.isKnownPath(candidate))
  ) {
    return candidate;
  }

  return fallback;
}
