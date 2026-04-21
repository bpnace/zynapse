import { WorkspaceRoutePlaceholder } from "@/components/workspace/shared/workspace-route-placeholder";

export default function BrandTeamPage() {
  return (
    <WorkspaceRoutePlaceholder
      eyebrow="Brands / Team"
      title="Team access is scaffolded in the brand workspace."
      description="This route reserves room for reviewers, legal approvers, media buyers, and future invite management without overloading the shell later."
      checkpoints={[
        "Stakeholder roster and permissions.",
        "Invite and role-management surface.",
      ]}
    />
  );
}
