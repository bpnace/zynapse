import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { adminWorkspaceRoutes } from "@/lib/workspace/routes";

export default function AdminSettingsPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Admin / Settings"
      title="Admin settings entry is wired into the new shell."
      description="This placeholder keeps the shell-level settings affordance live while the admin-specific preferences, audit policies, and operator controls are designed."
      checkpoints={[
        "Reserve a stable settings destination for the admin shell.",
        "Keep shell identity complete on desktop and mobile.",
      ]}
      ctaHref={adminWorkspaceRoutes.audit()}
      ctaLabel="Open audit queue"
    />
  );
}
