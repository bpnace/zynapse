import { StatusPill } from "@/components/workspace/dashboard/status-pill";
import { formatWorkspaceLabel } from "@/lib/workspace/formatting";

type StageTrackerProps = {
  stages: {
    key: string;
    status: string;
  }[];
  currentStage: string | null;
};

export function StageTracker({ stages, currentStage }: StageTrackerProps) {
  return (
    <section className="workspace-panel px-5 py-5">
      <div className="space-y-2">
        <p className="workspace-section-label">Fortschritt</p>
        <p className="text-sm leading-6 text-[var(--workspace-copy-body)]">
          {currentStage
            ? `Die aktuelle Kampagne befindet sich in ${formatWorkspaceLabel(currentStage)}.`
            : "Für diese Kampagne ist noch kein Statusverlauf verfügbar."}
        </p>
      </div>
      {stages.length > 0 ? (
        <div className="mt-5 workspace-split-list">
          {stages.map((stage) => (
            <div
              key={stage.key}
              className="flex items-center justify-between gap-3 py-3"
            >
              <span className="text-sm font-medium text-[var(--workspace-copy-strong)]">
                {formatWorkspaceLabel(stage.key)}
              </span>
              <StatusPill value={stage.status} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
