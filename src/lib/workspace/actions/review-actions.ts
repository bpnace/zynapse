"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull, desc, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { workspaceCapabilities } from "@/lib/auth/roles";
import { assets } from "@/lib/db/schema/assets";
import { campaigns } from "@/lib/db/schema/campaigns";
import { campaignStages } from "@/lib/db/schema/campaign-stages";
import { comments } from "@/lib/db/schema/comments";
import { reviewThreads } from "@/lib/db/schema/review-threads";
import {
  workspaceCommentSchema,
  workspaceDecisionSchema,
} from "@/lib/validation/workspace-review";
import { deriveCampaignReviewState } from "@/lib/workspace/review/state";

type ReviewMutationResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

async function getReviewMutationContext(campaignId: string, assetId: string) {
  const bootstrap = await requireWorkspaceAccess();
  const capability = workspaceCapabilities[bootstrap.membership.role];

  if (!capability.canReviewAssets) {
    return {
      error: "Du hast keine Berechtigung, Kampagnen-Assets zu reviewen.",
    } as const;
  }

  const db = getDb();

  const asset = await db
    .select({
      id: assets.id,
      campaignId: assets.campaignId,
      reviewStatus: assets.reviewStatus,
      organizationId: campaigns.organizationId,
    })
    .from(assets)
    .innerJoin(campaigns, eq(assets.campaignId, campaigns.id))
    .where(and(eq(assets.id, assetId), eq(campaigns.id, campaignId)))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (!asset || asset.organizationId !== bootstrap.organization.id) {
    return {
      error: "Dieses Review-Ziel ist im aktuellen Workspace nicht verfügbar.",
    } as const;
  }

  return {
    db,
    bootstrap,
    asset,
  } as const;
}

async function getOrCreateThread(
  db: ReturnType<typeof getDb>,
  assetId: string,
  createdBy: string,
) {
  const existingThread = await db
    .select()
    .from(reviewThreads)
    .where(and(eq(reviewThreads.assetId, assetId), isNull(reviewThreads.resolvedAt)))
    .orderBy(desc(reviewThreads.id))
    .limit(1)
    .then((rows) => rows[0] ?? null);

  if (existingThread) {
    return existingThread;
  }

  const [thread] = await db
    .insert(reviewThreads)
    .values({
      assetId,
      createdBy,
      anchorJson: null,
    })
    .returning();

  return thread;
}

async function syncCampaignReviewState(
  db: ReturnType<typeof getDb>,
  campaignId: string,
) {
  const campaignAssets = await db
    .select({
      id: assets.id,
      reviewStatus: assets.reviewStatus,
    })
    .from(assets)
    .where(eq(assets.campaignId, campaignId));

  const derived = deriveCampaignReviewState(
    campaignAssets.map((asset) => asset.reviewStatus),
  );

  await db
    .update(campaigns)
    .set({
      currentStage: derived.currentStage,
    })
    .where(eq(campaigns.id, campaignId));

  await db
    .update(campaignStages)
    .set({
      status: derived.inReviewStatus,
      completedAt: derived.inReviewStatus === "completed" ? new Date() : null,
      startedAt: derived.inReviewStatus === "in_progress" ? new Date() : null,
    })
    .where(
      and(
        eq(campaignStages.campaignId, campaignId),
        eq(campaignStages.stageKey, "in_review"),
      ),
    );

  await db
    .update(campaignStages)
    .set({
      status: derived.approvedStatus,
      startedAt: derived.approvedStatus === "in_progress" ? new Date() : null,
      completedAt: null,
    })
    .where(
      and(
        eq(campaignStages.campaignId, campaignId),
        eq(campaignStages.stageKey, "approved"),
      ),
    );

  await db
    .update(campaignStages)
    .set({
      status: derived.handoverReadyStatus,
      startedAt: null,
      completedAt: null,
    })
    .where(
      and(
        eq(campaignStages.campaignId, campaignId),
        eq(campaignStages.stageKey, "handover_ready"),
      ),
    );
}

function revalidateReviewPaths(campaignId: string) {
  revalidatePath("/workspace");
  revalidatePath(`/workspace/campaigns/${campaignId}`);
  revalidatePath(`/workspace/campaigns/${campaignId}/review`);
  revalidatePath(`/workspace/campaigns/${campaignId}/handover`);
}

export async function addReviewComment(
  campaignId: string,
  assetId: string,
  body: string,
): Promise<ReviewMutationResult> {
  const parsed = workspaceCommentSchema.safeParse({
    body,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Bitte ergänze eine konkretere Review-Notiz, bevor du speicherst.",
    };
  }

  const context = await getReviewMutationContext(campaignId, assetId);

  if ("error" in context && context.error) {
    return {
      success: false,
      message: context.error,
    };
  }

  const thread = await getOrCreateThread(
    context.db,
    assetId,
    context.bootstrap.membership.role,
  );

  await context.db.insert(comments).values({
    threadId: thread.id,
    authorId: context.bootstrap.membership.role,
    body: parsed.data.body,
    commentType: "comment",
  });

  revalidateReviewPaths(campaignId);

  return {
    success: true,
    message: "Review-Notiz gespeichert.",
  };
}

export async function applyReviewDecision(
  campaignId: string,
  assetId: string,
  input: {
    decision: "approved" | "changes_requested";
    note?: string;
  },
): Promise<ReviewMutationResult> {
  const parsed = workspaceDecisionSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Diese Review-Entscheidung ist ungültig.",
    };
  }

  const context = await getReviewMutationContext(campaignId, assetId);

  if ("error" in context && context.error) {
    return {
      success: false,
      message: context.error,
    };
  }

  const decision = parsed.data.decision;
  const reviewStatus = decision;
  const commentBody =
    parsed.data.note.trim().length > 0
      ? parsed.data.note
      : decision === "approved"
        ? "Im Review freigegeben."
        : "Im Review zur Überarbeitung markiert.";

  const thread = await getOrCreateThread(
    context.db,
    assetId,
    context.bootstrap.membership.role,
  );

  await context.db.insert(comments).values({
    threadId: thread.id,
    authorId: context.bootstrap.membership.role,
    body: commentBody,
    commentType: decision === "approved" ? "approval_note" : "change_request",
  });

  await context.db
    .update(assets)
    .set({
      reviewStatus,
    })
    .where(eq(assets.id, assetId));

  const assetThreadIds = await context.db
    .select({
      id: reviewThreads.id,
    })
    .from(reviewThreads)
    .where(eq(reviewThreads.assetId, assetId));

  if (decision === "approved") {
    await context.db
      .update(reviewThreads)
      .set({
        resolvedAt: new Date(),
      })
      .where(
        inArray(
          reviewThreads.id,
          assetThreadIds.map((threadRow) => threadRow.id),
        ),
      );
  } else {
    await context.db
      .update(reviewThreads)
      .set({
        resolvedAt: null,
      })
      .where(eq(reviewThreads.id, thread.id));
  }

  await syncCampaignReviewState(context.db, campaignId);
  revalidateReviewPaths(campaignId);

  return {
    success: true,
    message:
      decision === "approved"
        ? "Asset freigegeben."
        : "Änderungswunsch gespeichert.",
  };
}
