import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";

export default function CreativeProfilePage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Profile"
      title="Profile settings now have a stable creative route."
      description="The shell-level settings entry lands here so creative positioning, capabilities, and future readiness controls can move into a dedicated profile surface."
      checkpoints={[
        "Capabilities, tools, roles, and portfolio context.",
        "Future readiness and preference controls.",
      ]}
    />
  );
}
