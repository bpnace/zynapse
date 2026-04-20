import { redirect } from "next/navigation";
import { opsWorkspaceRoutes } from "@/lib/workspace/routes";

export const dynamic = "force-dynamic";

export default async function OpsReviewReadinessPage() {
  redirect(opsWorkspaceRoutes.delivery());
}
