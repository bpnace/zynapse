import Link from "next/link";
import { FolderKanban, MessageSquareMore } from "lucide-react";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";
import { StatusPill } from "@/components/workspace/dashboard/status-pill";

type CreativeCampaignIndexProps = {
  assignments: Array<{
    id: string;
    assignmentRole: string;
    status: string;
    campaign: {
      id: string;
      name: string;
      currentStage: string;
      packageTier: string;
    } | null;
    tasks: Array<{
      id: string;
      title: string;
      description: string | null;
      status: string;
      priority: string;
    }>;
  }>;
  summary: {
    inProgress: number;
    todo: number;
    blocked: number;
    submitted: number;
  };
};

export function CreativeCampaignIndex({ assignments, summary }: CreativeCampaignIndexProps) {
  return (
    <div className="workspace-page-stack">
      <section className="workspace-topbar px-5 py-5 sm:px-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="workspace-section-label">Assigned campaigns</span>
            <span className="workspace-stat-chip">{assignments.length} Kampagnen</span>
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-[2.05rem] leading-[1] font-semibold tracking-[-0.05em] text-[var(--workspace-copy-strong)]">
              Aktive Kampagnen und Task-Räume
            </h1>
            <p className="max-w-3xl text-[0.98rem] leading-7 text-[var(--workspace-copy-body)]">
              Hier siehst du, welche Kampagnen dir aktuell zugewiesen sind und in welchen Räumen gerade Ausführung, Revision oder Übergabe vorbereitet wird.
            </p>
          </div>
          <div className="workspace-stat-strip">
            <span className="workspace-stat-chip">{summary.inProgress} in Arbeit</span>
            <span className="workspace-stat-chip">{summary.todo} offen</span>
            <span className="workspace-stat-chip">{summary.blocked} blockiert</span>
            <span className="workspace-stat-chip">{summary.submitted} eingereicht</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {assignments.map((assignment) => (
          <article key={assignment.id} className="workspace-panel px-6 py-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="workspace-section-label">Zugewiesene Kampagne</p>
                <h2 className="font-display text-[1.75rem] leading-[1.03] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
                  {assignment.campaign?.name ?? "Campaign pending"}
                </h2>
                <div className="workspace-stat-strip">
                  <span className="workspace-stat-chip">Rolle {assignment.assignmentRole}</span>
                  <span className="workspace-stat-chip">Status {assignment.status}</span>
                  {assignment.campaign ? (
                    <span className="workspace-stat-chip">{assignment.campaign.packageTier}</span>
                  ) : null}
                </div>
              </div>
              {assignment.campaign ? (
                <Link
                  href={creativeWorkspaceRoutes.campaigns.detail(assignment.campaign.id)}
                  className="workspace-button workspace-button-primary"
                >
                  Task-Raum öffnen
                </Link>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.72fr)]">
              <div className="workspace-panel-muted px-4 py-4">
                <p className="workspace-section-label">Aktuelle Aufgaben</p>
                <div className="mt-3 workspace-split-list">
                  {assignment.tasks.length > 0 ? (
                    assignment.tasks.map((task) => (
                      <div key={task.id} className="py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--workspace-copy-strong)]">
                              {task.title}
                            </p>
                            {task.description ? (
                              <p className="mt-2 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                                {task.description}
                              </p>
                            ) : null}
                          </div>
                          <StatusPill value={task.status} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="py-3 text-sm leading-6 text-[var(--workspace-copy-muted)]">
                      Für diese Kampagne liegen aktuell keine offenen Tasks vor.
                    </p>
                  )}
                </div>
              </div>

              <div className="workspace-panel-muted px-4 py-4">
                <p className="workspace-section-label">Kampagnenkontext</p>
                <div className="mt-3 space-y-3 text-sm text-[var(--workspace-copy-body)]">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                    <span>
                      {assignment.campaign?.currentStage ?? "Kein Kampagnenstatus"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquareMore className="h-4 w-4 text-[var(--workspace-copy-muted)]" />
                    <span>{assignment.tasks.length} Task{assignment.tasks.length === 1 ? "" : "s"} sichtbar</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}

        {assignments.length === 0 ? (
          <section className="workspace-panel px-6 py-6">
            <p className="workspace-section-label">Assigned campaigns</p>
            <h2 className="mt-3 font-display text-[1.7rem] leading-[1.04] font-semibold tracking-[-0.04em] text-[var(--workspace-copy-strong)]">
              Noch keine zugewiesenen Kampagnen
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--workspace-copy-muted)]">
              Sobald dir Kampagnen zugewiesen werden, erscheinen sie hier als eigene Task-Räume.
            </p>
          </section>
        ) : null}
      </section>
    </div>
  );
}
