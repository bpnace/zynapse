import { notFound } from "next/navigation";
import { ReviewRoom } from "@/components/workspace/review/review-room";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { getWorkspaceCapabilities } from "@/lib/auth/roles";
import { getReviewRoomView } from "@/lib/workspace/queries/get-review-room-view";

export const dynamic = "force-dynamic";

type ReviewPageProps = {
  params: Promise<{ campaignId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReviewPage({
  params,
  searchParams,
}: ReviewPageProps) {
  const bootstrap = await requireWorkspaceAccess();
  const { campaignId } = await params;
  const query = (await searchParams) ?? {};
  const assetId =
    typeof query.asset === "string" && query.asset.length > 0
      ? query.asset
      : null;

  const reviewRoom = await getReviewRoomView({
    organizationId: bootstrap.organization.id,
    campaignId,
    selectedAssetId: assetId,
  });

  if (!reviewRoom) {
    notFound();
  }

  return (
    <ReviewRoom
      campaign={reviewRoom.campaign}
      assets={reviewRoom.assets}
      selectedAsset={reviewRoom.selectedAsset}
      canReview={
        getWorkspaceCapabilities(bootstrap.membership.role, {
          isReadOnly: bootstrap.demo.isReadOnly,
        }).canReviewAssets
      }
      demo={bootstrap.demo}
    />
  );
}
