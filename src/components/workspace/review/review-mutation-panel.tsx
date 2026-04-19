"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addReviewComment,
  applyReviewDecision,
} from "@/lib/workspace/actions/review-actions";
import type { WorkspaceDemoState } from "@/lib/workspace/demo";

type ReviewMutationPanelProps = {
  campaignId: string;
  assetId: string;
  canReview: boolean;
  demo: WorkspaceDemoState;
};

export function ReviewMutationPanel({
  campaignId,
  assetId,
  canReview,
  demo,
}: ReviewMutationPanelProps) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  function runMutation(
    action: "comment" | "approved" | "changes_requested",
  ) {
    if (!canReview) {
      return;
    }

    setIsPending(true);
    setMessage("");

    startTransition(async () => {
      const result =
        action === "comment"
          ? await addReviewComment(campaignId, assetId, note)
          : await applyReviewDecision(campaignId, assetId, {
              decision: action,
              note,
            });

      setIsPending(false);
      setMessage(result.message);

      if (result.success) {
        setNote("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="workspace-section-label" htmlFor="review-note">
          Notiz zur Freigabe
        </label>
        <textarea
          id="review-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          disabled={!canReview || isPending}
          placeholder="Feedback, Freigabekontext oder einen klaren Änderungswunsch ergänzen."
          className="field-input mt-3 min-h-32 resize-y"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          className="workspace-button workspace-button-secondary"
          disabled={!canReview || isPending}
          onClick={() => runMutation("comment")}
        >
          Notiz speichern
        </button>
        <button
          type="button"
          className="workspace-button workspace-button-primary"
          disabled={!canReview || isPending}
          onClick={() => runMutation("approved")}
        >
          Variante freigeben
        </button>
        <button
          type="button"
          className="workspace-button workspace-button-secondary"
          disabled={!canReview || isPending}
          onClick={() => runMutation("changes_requested")}
        >
          Änderung anfordern
        </button>
      </div>

      <p className="text-xs leading-5 text-[var(--workspace-copy-muted)]">
        {demo.isDemoWorkspace
          ? demo.mutationMessage
          : canReview
          ? "Notizen und Entscheidungen werden sofort gespeichert und aktualisieren den Freigabestatus für Variante und Kampagne."
          : "Diese Rolle kann die Historie sehen, aber keine Entscheidungen absenden."}
      </p>

      {message ? (
        <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">{message}</p>
      ) : null}
    </div>
  );
}
