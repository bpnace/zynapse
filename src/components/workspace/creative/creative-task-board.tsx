import Link from "next/link";
import { creativeWorkspaceRoutes } from "@/lib/workspace/routes";

type CreativeTaskBoardProps = {
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

export function CreativeTaskBoard({ assignments, summary }: CreativeTaskBoardProps) {
  return (
    <div className="grid gap-4">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["In progress", summary.inProgress],
          ["Todo", summary.todo],
          ["Blocked", summary.blocked],
          ["Submitted", summary.submitted],
        ].map(([label, value]) => (
          <article key={label} className="workspace-panel rounded-[1.5rem] p-5">
            <p className="workspace-eyebrow">{label}</p>
            <p className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em]">
              {value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4">
        {assignments.map((assignment) => (
          <article key={assignment.id} className="workspace-panel rounded-[1.6rem] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="workspace-eyebrow">Assigned campaign</p>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">
                  {assignment.campaign?.name ?? "Campaign pending"}
                </h2>
                <p className="text-sm text-[var(--workspace-copy-muted)]">
                  Role: {assignment.assignmentRole} · Status: {assignment.status}
                </p>
              </div>
              {assignment.campaign ? (
                <Link
                  href={creativeWorkspaceRoutes.campaigns.detail(assignment.campaign.id)}
                  className="workspace-button inline-flex items-center justify-center"
                >
                  Open task room
                </Link>
              ) : null}
            </div>

            <div className="mt-5 grid gap-3">
              {assignment.tasks.map((task) => (
                <div key={task.id} className="rounded-[1.2rem] border border-[var(--workspace-line)] px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
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
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--workspace-copy-muted)]">
                      {task.priority}
                    </p>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--workspace-copy-muted)]">
                    {task.status}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
