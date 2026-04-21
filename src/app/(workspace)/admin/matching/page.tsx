import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";
import { adminWorkspaceRoutes } from "@/lib/workspace/routes";

export default function AdminMatchingPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Admin / Matching"
      title="Matching now has a first-class route in the admin shell."
      description="This route will become the home for creative fit decisions, routing confidence, and assignment overrides once the matching model is promoted into the core workflow."
      checkpoints={[
        "Surface recommended creative routes.",
        "Show confidence, load, and suitability side by side.",
        "Allow human override before task issuance.",
      ]}
      ctaHref={adminWorkspaceRoutes.requests()}
    />
  );
}
