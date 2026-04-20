import { OpsControlPlaneScreen } from "@/components/workspace/ops/ops-control-plane-screen";
import { requireOpsWorkspaceAccess } from "@/lib/auth/guards";
import { getOpsOverview } from "@/lib/workspace/queries/get-ops-overview";

export const dynamic = "force-dynamic";

export default async function OpsAssignmentsPage() {
  const bootstrap = await requireOpsWorkspaceAccess();
  const view = await getOpsOverview({
    organizationId: bootstrap.organization.id,
  });

  return <OpsControlPlaneScreen view={view} mode="assignments" />;
}
