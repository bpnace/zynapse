function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function deriveSiblingEmail(baseEmail, suffix) {
  const normalizedEmail = normalizeEmail(baseEmail);
  const [localPart, domain] = normalizedEmail.split("@");

  if (!localPart || !domain) {
    throw new Error(`Cannot derive ${suffix} demo email from '${baseEmail}'.`);
  }

  return `${localPart}+${suffix}@${domain}`;
}

function appendParticipant(participants, seenEmails, participant) {
  const normalizedEmail = normalizeEmail(participant.email);

  if (seenEmails.has(normalizedEmail)) {
    return;
  }

  seenEmails.add(normalizedEmail);
  participants.push({
    ...participant,
    email: normalizedEmail,
  });
}

export function buildDemoWorkspaceParticipants(input) {
  const participants = [];
  const seenEmails = new Set();

  appendParticipant(participants, seenEmails, {
    key: "brand",
    email: input.canonicalBrandEmail,
    role: "brand_reviewer",
    workspaceType: "brand",
  });

  if (input.requestedBrandEmail) {
    appendParticipant(participants, seenEmails, {
      key: "brand_login",
      email: input.requestedBrandEmail,
      role: "brand_reviewer",
      workspaceType: "brand",
    });
  }

  appendParticipant(participants, seenEmails, {
    key: "creative",
    email:
      input.creativeEmail ??
      deriveSiblingEmail(input.canonicalBrandEmail, "creative"),
    role: "creative_lead",
    workspaceType: "creative",
  });

  appendParticipant(participants, seenEmails, {
    key: "ops",
    email:
      input.opsEmail ??
      deriveSiblingEmail(input.canonicalBrandEmail, "ops"),
    role: "ops_admin",
    workspaceType: "ops",
  });

  return participants;
}

export function deriveWorkflowSeedState(currentStage) {
  const workflowStatus =
    currentStage === "handover_ready"
      ? "handover"
      : currentStage === "approved" || currentStage === "in_review"
        ? "review"
        : "production";
  const reviewStatus =
    currentStage === "approved" || currentStage === "handover_ready"
      ? "approved"
      : currentStage === "in_review"
        ? "in_review"
        : "not_ready";
  const deliveryStatus =
    currentStage === "handover_ready"
      ? "ready"
      : currentStage === "approved"
        ? "preparing"
        : "not_ready";
  const commercialStatus =
    currentStage === "approved" || currentStage === "handover_ready"
      ? "ready_for_pilot"
      : "not_ready";

  return {
    workflowStatus,
    reviewStatus,
    deliveryStatus,
    commercialStatus,
  };
}
