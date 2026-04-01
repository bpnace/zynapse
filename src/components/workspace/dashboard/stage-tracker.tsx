type StageTrackerProps = {
  stages: {
    key: string;
    status: string;
  }[];
  currentStage: string | null;
};

export function StageTracker({ stages, currentStage }: StageTrackerProps) {
  return (
    <section className="rounded-[1.7rem] border border-[color:var(--line)] bg-white/70 p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
        Aktueller Status
      </p>
      <p className="mt-3 text-base text-[var(--copy-body)]">
        {currentStage
          ? `Die aktuelle Kampagne steht auf ${currentStage}.`
          : "Noch keine Kampagnenstufen vorhanden. Die Seed-Daten folgen im nächsten Schritt."}
      </p>
      {stages.length > 0 ? (
        <div className="mt-5 grid gap-3">
          {stages.map((stage) => (
            <div
              key={stage.key}
              className="flex items-center justify-between rounded-[1rem] border border-[color:var(--line)] bg-white p-3"
            >
              <span className="text-sm font-medium text-[var(--copy-strong)]">
                {stage.key}
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--copy-muted)]">
                {stage.status}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
