"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addReviewComment,
  applyReviewDecision,
} from "@/lib/workspace/actions/review-actions";

type ReviewMutationPanelProps = {
  campaignId: string;
  assetId: string;
  canReview: boolean;
};

export function ReviewMutationPanel({
  campaignId,
  assetId,
  canReview,
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
          Review note
        </label>
        <textarea
          id="review-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          disabled={!canReview || isPending}
          placeholder="Leave a comment, approval note, or change request context."
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
          Add comment
        </button>
        <button
          type="button"
          className="workspace-button workspace-button-primary"
          disabled={!canReview || isPending}
          onClick={() => runMutation("approved")}
        >
          Approve asset
        </button>
        <button
          type="button"
          className="workspace-button workspace-button-secondary"
          disabled={!canReview || isPending}
          onClick={() => runMutation("changes_requested")}
        >
          Request changes
        </button>
      </div>

      <p className="text-xs leading-5 text-[var(--workspace-copy-muted)]">
        {canReview
          ? "Comments and decisions persist immediately and update the asset and campaign review state."
          : "This workspace role can view review history but cannot submit review actions."}
      </p>

      {message ? (
        <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">{message}</p>
      ) : null}
    </div>
  );
}
