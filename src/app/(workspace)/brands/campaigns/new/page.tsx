import { notFound, redirect } from "next/navigation";
import { CampaignRequestBuilder } from "@/components/workspace/campaign-request/campaign-request-builder";
import { requireWorkspaceAccess } from "@/lib/auth/guards";
import { createEmptyBriefInput } from "@/lib/workspace/briefs/form-helpers";
import { getBriefView, getBriefsList } from "@/lib/workspace/queries/get-brief-view";
import { shouldGateBrandHome } from "@/lib/workspace/profile-completion";
import { brandsWorkspaceRoutes } from "@/lib/workspace/routes";

export const dynamic = "force-dynamic";

type BrandNewCampaignPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BrandNewCampaignPage({
  searchParams,
}: BrandNewCampaignPageProps) {
  const bootstrap = await requireWorkspaceAccess();

  if (shouldGateBrandHome(bootstrap.brandProfile)) {
    redirect(brandsWorkspaceRoutes.onboarding());
  }

  const query = (await searchParams) ?? {};
  const draftId = typeof query.draft === "string" && query.draft.length > 0 ? query.draft : null;

  const [draftView, recentBriefs] = await Promise.all([
    draftId ? getBriefView(bootstrap.organization.id, draftId) : Promise.resolve(null),
    getBriefsList(bootstrap.organization.id),
  ]);

  if (draftId && !draftView) {
    notFound();
  }

  return (
    <CampaignRequestBuilder
      demo={bootstrap.demo}
      briefId={draftView?.brief.id ?? null}
      status={draftView?.brief.status ?? "draft"}
      initialValues={draftView?.values ?? createEmptyBriefInput()}
      recentRequests={recentBriefs.map((brief) => ({
        id: brief.id,
        title: brief.title,
        status: brief.status,
        startedAt: brief.startedAt,
      }))}
    />
  );
}
