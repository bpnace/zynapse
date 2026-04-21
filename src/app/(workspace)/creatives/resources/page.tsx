import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";

export default function CreativeResourcesPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Creatives / Resources"
      title="Resources now have a dedicated creative route."
      description="The refreshed workspace can now point to a future resource center for brand context, standards, references, and creative operating rules."
      checkpoints={[
        "Centralize standards, references, and source material.",
      ]}
    />
  );
}
