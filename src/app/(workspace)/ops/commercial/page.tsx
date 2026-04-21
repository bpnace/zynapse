import { redirect } from "next/navigation";
import { adminWorkspaceRoutes } from "@/lib/workspace/routes";

export const dynamic = "force-dynamic";

export default async function OpsCommercialAliasPage() {
  redirect(adminWorkspaceRoutes.exceptions());
}
