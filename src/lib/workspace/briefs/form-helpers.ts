import type { WorkspaceBriefInput } from "@/lib/validation/workspace-brief";

export function createEmptyBriefInput(): WorkspaceBriefInput {
  return {
    title: "",
    objective: "",
    offer: "",
    audience: "",
    channels: "",
    hooks: "",
    creativeReferences: "",
    budgetRange: "",
    timeline: "",
    approvalNotes: "",
  };
}

export function serializeBriefReferences(input: WorkspaceBriefInput) {
  return JSON.stringify({
    hooks: input.hooks,
    creativeReferences: input.creativeReferences,
  });
}

export function parseBriefReferences(value: string) {
  try {
    const parsed = JSON.parse(value) as {
      hooks?: string;
      creativeReferences?: string;
    };

    return {
      hooks: parsed.hooks ?? "",
      creativeReferences: parsed.creativeReferences ?? "",
    };
  } catch {
    return {
      hooks: "",
      creativeReferences: "",
    };
  }
}
