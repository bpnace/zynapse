import { OpsControlPlaneScreen } from "@/components/workspace/ops/ops-control-plane-screen";
import { requireAdminAccess } from "@/lib/auth/guards";
import { getOpsOverview } from "@/lib/workspace/queries/get-ops-overview";

export const dynamic = "force-dynamic";

export default async function AdminExceptionsPage() {
  const bootstrap = await requireAdminAccess();
  const view = await getOpsOverview({
    organizationId: bootstrap.organization.id,
  });

  return <OpsControlPlaneScreen view={view} mode="commercial" />;
}
