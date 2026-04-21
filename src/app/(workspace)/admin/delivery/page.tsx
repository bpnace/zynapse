import { AdminControlPanelScreen } from "@/components/workspace/admin/admin-control-panel-screen";
import { requireAdminAccess } from "@/lib/auth/guards";
import { getOpsOverview } from "@/lib/workspace/queries/get-ops-overview";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
  const bootstrap = await requireAdminAccess();
  const view = await getOpsOverview({
    organizationId: bootstrap.organization.id,
  });

  return <AdminControlPanelScreen view={view} mode="review" />;
}
