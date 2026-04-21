import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";

export default function BrandAssetsPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Assets"
      title="The assets library route is scaffolded."
      description="This route gives the refreshed shell a stable destination for approved files, references, and reusable delivery materials."
      checkpoints={[
        "Approved asset packs will surface here.",
        "Reference material and reusable files stay accessible.",
      ]}
    />
  );
}
