import { redirect } from "next/navigation";
import { adminWorkspaceRoutes } from "@/lib/workspace/routes";

export const dynamic = "force-dynamic";

type OpsCampaignDetailAliasPageProps = {
  params: Promise<{
    campaignId: string;
  }>;
};

export default async function OpsCampaignDetailAliasPage({
  params,
}: OpsCampaignDetailAliasPageProps) {
  const { campaignId } = await params;
  redirect(adminWorkspaceRoutes.campaignDetail(campaignId));
}
