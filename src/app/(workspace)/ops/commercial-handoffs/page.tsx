import { redirect } from "next/navigation";
import { adminWorkspaceRoutes } from "@/lib/workspace/routes";

export const dynamic = "force-dynamic";

export default async function OpsCommercialHandoffsAliasPage() {
  redirect(adminWorkspaceRoutes.delivery());
}
