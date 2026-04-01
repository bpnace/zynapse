type WorkspaceShellProps = {
  organizationName: string;
  role: string;
  website?: string | null;
  children: React.ReactNode;
};

export function WorkspaceShell({
  organizationName,
  role,
  website,
  children,
}: WorkspaceShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--copy-strong)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-[color:var(--line)] bg-white/70 p-6 shadow-[0_10px_24px_rgba(16,24,40,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
                Brand Workspace
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.05em]">
                {organizationName}
              </h1>
              {website ? (
                <p className="mt-2 text-sm text-[var(--copy-body)]">{website}</p>
              ) : null}
            </div>
            <span className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--copy-muted)]">
              {role}
            </span>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
