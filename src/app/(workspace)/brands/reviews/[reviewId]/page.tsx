import { notFound, redirect } from "next/navigation";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { resolveBrandReviewDetailHref } from "@/lib/workspace/queries/resolve-brand-detail-route";

type BrandReviewDetailPageProps = {
  params: Promise<{
    reviewId: string;
  }>;
};

export default async function BrandReviewDetailPage({
  params,
}: BrandReviewDetailPageProps) {
  const bootstrap = await requireWorkspaceAccess();
  const { reviewId } = await params;
  const targetHref = await resolveBrandReviewDetailHref({
    organizationId: bootstrap.organization.id,
    reviewId,
  });

  if (!targetHref) {
    notFound();
  }

  redirect(targetHref);
}
