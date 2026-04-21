export type BrandsWorkspaceNamespace = "brands";

const DEFAULT_NAMESPACE: BrandsWorkspaceNamespace = "brands";

function getPathnameOnly(pathname: string) {
  return pathname.split(/[?#]/, 1)[0] ?? pathname;
}

function hasMatchingPrefix(pathname: string, prefixes: string[]) {
  const safePathname = getPathnameOnly(pathname);

  return prefixes.some((prefix) => {
    if (safePathname === prefix) {
      return true;
    }

    return safePathname.startsWith(`${prefix}/`);
  });
}

function getBrandBasePath() {
  return "/brands";
}

function buildBrandPath(suffix: string) {
  return `${getBrandBasePath()}${suffix}`;
}

function getBrandProtectedPrefixes() {
  return [
    "/brands/home",
    "/brands/today",
    buildBrandPath("/onboarding"),
    buildBrandPath("/briefs"),
    buildBrandPath("/campaigns"),
    buildBrandPath("/reviews"),
    buildBrandPath("/deliveries"),
    buildBrandPath("/assets"),
    buildBrandPath("/profile"),
    buildBrandPath("/team"),
    buildBrandPath("/billing"),
    buildBrandPath("/pilot-request"),
  ];
}

function isBrandProtectedPath(pathname: string) {
  return hasMatchingPrefix(pathname, getBrandProtectedPrefixes());
}

function getCreativeProtectedPrefixes() {
  return [
    "/creatives/home",
    "/creatives/tasks",
    "/creatives/feedback",
    "/creatives/campaigns",
    "/creatives/invitations",
    "/creatives/revisions",
    "/creatives/profile",
    "/creatives/availability",
    "/creatives/resources",
    "/creatives/payouts",
  ];
}

function isCreativeProtectedPath(pathname: string) {
  return hasMatchingPrefix(pathname, getCreativeProtectedPrefixes());
}

function getAdminProtectedPrefixes() {
  return [
    "/admin",
    "/admin/requests",
    "/admin/setups",
    "/admin/matching",
    "/admin/assignments",
    "/admin/reviews",
    "/admin/delivery",
    "/admin/exceptions",
    "/admin/audit",
    "/admin/settings",
  ];
}

function isAdminProtectedPath(pathname: string) {
  return hasMatchingPrefix(pathname, getAdminProtectedPrefixes());
}

function getOpsProtectedPrefixes() {
  return [
    "/ops",
    "/ops/campaigns",
    "/ops/assignments",
    "/ops/delivery",
    "/ops/commercial",
    "/ops/review-readiness",
    "/ops/commercial-handoffs",
  ];
}

function isOpsProtectedPath(pathname: string) {
  return hasMatchingPrefix(pathname, getOpsProtectedPrefixes());
}

export const creativeWorkspaceRoutes = {
  landing() {
    return "/app";
  },
  home() {
    return "/creatives/home";
  },
  tasks() {
    return "/creatives/tasks";
  },
  taskDetail(taskId: string) {
    return `/creatives/tasks/${taskId}`;
  },
  feedback() {
    return "/creatives/feedback";
  },
  invitations: {
    index() {
      return "/creatives/invitations";
    },
    detail(invitationId: string) {
      return `/creatives/invitations/${invitationId}`;
    },
  },
  revisions: {
    index() {
      return "/creatives/revisions";
    },
    detail(revisionId: string) {
      return `/creatives/revisions/${revisionId}`;
    },
  },
  profile() {
    return "/creatives/profile";
  },
  availability() {
    return "/creatives/availability";
  },
  resources() {
    return "/creatives/resources";
  },
  payouts() {
    return "/creatives/payouts";
  },
  campaigns: {
    index() {
      return "/creatives/campaigns";
    },
    detail(campaignId: string) {
      return `/creatives/campaigns/${campaignId}`;
    },
  },
  isKnownPath(pathname: string) {
    return isCreativeProtectedPath(pathname);
  },
};

export const adminWorkspaceRoutes = {
  root() {
    return "/admin";
  },
  campaignDetail(campaignId: string) {
    return `/admin/requests/campaigns/${campaignId}`;
  },
  requests() {
    return "/admin/requests";
  },
  setups() {
    return "/admin/setups";
  },
  matching() {
    return "/admin/matching";
  },
  assignments() {
    return "/admin/assignments";
  },
  reviews() {
    return "/admin/reviews";
  },
  delivery() {
    return "/admin/delivery";
  },
  exceptions() {
    return "/admin/exceptions";
  },
  audit() {
    return "/admin/audit";
  },
  settings() {
    return "/admin/settings";
  },
  isKnownPath(pathname: string) {
    return isAdminProtectedPath(pathname);
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
    return isOpsProtectedPath(pathname);
  },
};

export const brandsWorkspaceRoutes = {
  overview(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return "/brands/today";
  },
  home(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return "/brands/home";
  },
  onboarding(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return buildBrandPath("/onboarding");
  },
  profile(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return buildBrandPath("/profile");
  },
  team(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return buildBrandPath("/team");
  },
  billing(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return buildBrandPath("/billing");
  },
  assets(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
    void namespace;
    return buildBrandPath("/assets");
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
    index(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath("/campaigns");
    },
    new(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath("/campaigns/new");
    },
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
  reviews: {
    index(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath("/reviews");
    },
    detail(reviewId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath(`/reviews/${reviewId}`);
    },
  },
  deliveries: {
    index(namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath("/deliveries");
    },
    detail(deliveryId: string, namespace: BrandsWorkspaceNamespace = DEFAULT_NAMESPACE) {
      void namespace;
      return buildBrandPath(`/deliveries/${deliveryId}`);
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
            brandsWorkspaceRoutes.home(),
            brandsWorkspaceRoutes.onboarding(),
            brandsWorkspaceRoutes.profile(),
            brandsWorkspaceRoutes.assets(),
            brandsWorkspaceRoutes.team(),
            brandsWorkspaceRoutes.billing(),
            brandsWorkspaceRoutes.campaigns.index(),
            brandsWorkspaceRoutes.campaigns.new(),
            brandsWorkspaceRoutes.reviews.index(),
            brandsWorkspaceRoutes.deliveries.index(),
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
    return resolveWorkspaceNextPath(next, brandsWorkspaceRoutes.home(namespace));
  },
};

export function isProtectedWorkspacePath(pathname: string) {
  const safePathname = getPathnameOnly(pathname);

  return (
    safePathname === creativeWorkspaceRoutes.landing() ||
    brandsWorkspaceRoutes.isKnownPath(safePathname) ||
    creativeWorkspaceRoutes.isKnownPath(safePathname) ||
    adminWorkspaceRoutes.isKnownPath(safePathname) ||
    opsWorkspaceRoutes.isKnownPath(safePathname)
  );
}

export function resolveWorkspaceNextPath(
  next: string | null | undefined,
  fallback: string = brandsWorkspaceRoutes.home(),
) {
  const candidate = next?.trim() ?? "";

  if (candidate && !candidate.startsWith("//") && isProtectedWorkspacePath(candidate)) {
    return candidate;
  }

  return fallback;
}
