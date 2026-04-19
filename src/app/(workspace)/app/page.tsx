import { redirect } from "next/navigation";
import { requireWorkspaceResolverPath } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AppWorkspaceResolverPage() {
  const destination = await requireWorkspaceResolverPath();
  redirect(destination);
}
