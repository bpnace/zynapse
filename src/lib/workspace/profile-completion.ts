type ProfileCompletionInput = {
  website?: string | null;
  offerSummary?: string | null;
  targetAudience?: string | null;
  primaryChannels?: string | null;
  brandTone?: string | null;
  reviewNotes?: string | null;
  claimGuardrails?: string | null;
} | null;

const completionFields = [
  "website",
  "offerSummary",
  "targetAudience",
  "primaryChannels",
  "brandTone",
  "reviewNotes",
  "claimGuardrails",
] as const;

export function getBrandProfileCompletion(profile: ProfileCompletionInput) {
  const completed = completionFields.reduce((count, field) => {
    const value = profile?.[field];
    return typeof value === "string" && value.trim().length > 0 ? count + 1 : count;
  }, 0);

  const total = completionFields.length;

  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    isComplete: completed === total,
  };
}

export function shouldGateBrandHome(profile: ProfileCompletionInput) {
  return !getBrandProfileCompletion(profile).isComplete;
}
