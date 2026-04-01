export const seedTemplateKeys = [
  "d2c_product_launch",
  "performance_refresh",
  "review_sprint",
] as const;

export type SeedTemplateKey = (typeof seedTemplateKeys)[number];

export type SeedStageDefinition = {
  key:
    | "brief_received"
    | "setup_planned"
    | "production_ready"
    | "in_review"
    | "approved"
    | "handover_ready";
  status: "pending" | "in_progress" | "completed";
};

export type SeedAssetDefinition = {
  key: string;
  title: string;
  assetType: string;
  format: string;
  durationSeconds?: number;
  versionLabel: string;
  reviewStatus: "pending" | "approved" | "changes_requested" | "rejected";
  source: string;
  storagePath: string;
  thumbnailPath: string;
};

export type SeedCommentDefinition = {
  authorId: string;
  body: string;
  commentType: "comment" | "change_request" | "approval_note";
};

export type SeedReviewThreadDefinition = {
  assetKey: string;
  createdBy: string;
  anchorJson?: string;
  comments: SeedCommentDefinition[];
};

export type SeedTemplate = {
  key: SeedTemplateKey;
  label: string;
  campaignName: string;
  campaignGoal: string;
  packageTier: "starter" | "growth";
  currentStage:
    | "brief_received"
    | "setup_planned"
    | "production_ready"
    | "in_review"
    | "approved"
    | "handover_ready";
  stageDefinitions: SeedStageDefinition[];
  brandProfile: {
    offerSummary: string;
    targetAudience: string;
    primaryChannels: string;
    brandTone: string;
    reviewNotes: string;
    claimGuardrails: string;
  };
  preparedBlocks: {
    prepared: string;
    review: string;
    output: string;
    nextStep: string;
  };
  nextAction: {
    title: string;
    body: string;
  };
  assets: SeedAssetDefinition[];
  reviewThreads: SeedReviewThreadDefinition[];
};
