"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, TextInput, TextareaInput } from "@/components/forms/form-primitives";
import { submitCreativeAssetVersion } from "@/lib/workspace/actions/submit-creative-asset-version";

type CreativeSubmissionFormProps = {
  campaignId: string;
  assignmentId: string;
  assetId: string;
  taskId?: string | null;
  suggestedVersionLabel: string;
};

const initialState = {
  success: false,
  message: "",
};

export function CreativeSubmissionForm({
  campaignId,
  assignmentId,
  assetId,
  taskId,
  suggestedVersionLabel,
}: CreativeSubmissionFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitCreativeAssetVersion,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="campaignId" value={campaignId} />
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <input type="hidden" name="assetId" value={assetId} />
      {taskId ? <input type="hidden" name="taskId" value={taskId} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Version label">
          <TextInput name="versionLabel" defaultValue={suggestedVersionLabel} required />
        </Field>
        <Field label="Preview / storage path" hint="Use a public URL or a stable storage path.">
          <TextInput
            name="storagePath"
            defaultValue="https://example.com/delivery/version.mp4"
            required
          />
        </Field>
      </div>
      <Field label="Thumbnail path" hint="Optional poster or preview image.">
        <TextInput
          name="thumbnailPath"
          defaultValue="https://example.com/delivery/version-poster.jpg"
        />
      </Field>
      <Field
        label="Delivery notes"
        hint="Summarize what changed, what still needs ops review, and any export caveats."
      >
        <TextareaInput
          name="notes"
          defaultValue="Updated hook framing, tightened CTA timing, and aligned the export naming for ops review."
        />
      </Field>
      {state.message ? (
        <p
          className={
            state.success
              ? "text-sm text-[var(--accent-strong)]"
              : "text-sm text-[color:var(--signal-red)]"
          }
        >
          {state.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : "Submit version"}
        </Button>
      </div>
    </form>
  );
}
