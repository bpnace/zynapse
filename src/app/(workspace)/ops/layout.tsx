export const dynamic = "force-dynamic";

export default async function OpsWorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Legacy alias-only route family: keep /ops paths working, but do not expose
  // an ops shell because Admin is the only internal UI surface now.
  return children;
}
