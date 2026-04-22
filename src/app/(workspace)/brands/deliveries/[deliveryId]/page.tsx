import { notFound, redirect } from "next/navigation";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { resolveBrandDeliveryDetailHref } from "@/lib/workspace/queries/resolve-brand-detail-route";

type BrandDeliveryDetailPageProps = {
  params: Promise<{
    deliveryId: string;
  }>;
};

export default async function BrandDeliveryDetailPage({
  params,
}: BrandDeliveryDetailPageProps) {
  const bootstrap = await requireWorkspaceAccess();
  const { deliveryId } = await params;
  const targetHref = await resolveBrandDeliveryDetailHref({
    organizationId: bootstrap.organization.id,
    deliveryId,
  });

  if (!targetHref) {
    notFound();
  }

  redirect(targetHref);
}
