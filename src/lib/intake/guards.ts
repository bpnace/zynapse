export function ensureHumanSubmission({
  startedAt,
  website,
  now = Date.now(),
}: {
  startedAt: number;
  website: string;
  now?: number;
}) {
  if (website.trim().length > 0) {
    return {
      ok: false,
      reason: "Spam trap triggered.",
    };
  }

  const elapsed = now - startedAt;

  if (elapsed < 1200) {
    return {
      ok: false,
      reason: "Submission was sent too quickly.",
    };
  }

  if (elapsed > 1000 * 60 * 60 * 24 * 7) {
    return {
      ok: false,
      reason: "Submission expired. Please refresh and try again.",
    };
  }

  return {
    ok: true,
  };
}
