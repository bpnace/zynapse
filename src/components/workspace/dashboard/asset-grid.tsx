type AssetGridItem = {
  id: string;
  title: string;
  assetType: string;
  format: string | null;
  versionLabel: string | null;
  reviewStatus: string;
};

type AssetGridProps = {
  assets: AssetGridItem[];
};

export function AssetGrid({ assets }: AssetGridProps) {
  return (
    <section className="rounded-[1.7rem] border border-[color:var(--line)] bg-white/70 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--copy-muted)]">
            Assets
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em]">
            Seeded Deliverables
          </h2>
        </div>
      </div>

      {assets.length === 0 ? (
        <p className="mt-4 text-sm leading-6 text-[var(--copy-body)]">
          Noch keine Assets sichtbar. In Phase 2 wird hier der seeded Workspace mit
          echten Kampagnen-Assets erscheinen.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article
              key={asset.id}
              className="rounded-[1.3rem] border border-[color:var(--line)] bg-white p-4"
            >
              <p className="text-sm font-medium">{asset.title}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--copy-muted)]">
                {asset.assetType}
                {asset.format ? ` · ${asset.format}` : ""}
                {asset.versionLabel ? ` · ${asset.versionLabel}` : ""}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--copy-muted)]">
                {asset.reviewStatus}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
