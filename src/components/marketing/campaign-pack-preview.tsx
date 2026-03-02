import { SectionHeading } from "@/components/ui/section-heading";
import { campaignAngles } from "@/lib/mock-data/studio";

export function CampaignPackPreview() {
  return (
    <section
      className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Kampagnenlogik zuerst"
          title="Nicht das einzelne Video macht den Unterschied. Sondern die Logik davor."
          accent="Logik davor"
          copy="Bevor ein Creative gebaut wird, wird die Kampagne in Angles, Hooks, CTA-Routen, Cuts und Längen zerlegt. So wird aus 'wir brauchen Content' ein System, das sich testen und weiterdrehen lässt."
        />
        <ul className="space-y-3 text-base leading-7 text-[color:var(--copy-body)]">
          <li data-animate-copy>3 strategische Angles pro Pack</li>
          <li data-animate-copy>10 Hook-Richtungen mit klarer Testabsicht</li>
          <li data-animate-copy>5 CTA-Varianten pro Offer</li>
          <li data-animate-copy>6 Cuts pro Angle</li>
          <li data-animate-copy>3 Längen für Platzierung, Test und Iteration</li>
        </ul>
      </div>
      <div
        className="section-card section-surface-warm rounded-[var(--radius-card)] border-[rgba(191,106,83,0.16)] p-6 sm:p-7"
        data-animate-item
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-soft)]">
              Beispiel für ein Kampagnen-Pack
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)]">
              Creative-Testing-<span className="title-accent">Struktur</span>
            </h3>
          </div>
          <span className="rounded-[var(--radius-chip)] border border-[rgba(49,125,101,0.16)] bg-[rgba(156,244,215,0.18)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#236851]">
            Freigabebereit
          </span>
        </div>
        <div className="mt-6 grid gap-4">
          {campaignAngles.map((angle) => (
            <article
              key={angle.title}
              className="section-surface-paper rounded-[var(--radius-subcard)] border border-[rgba(56,67,84,0.12)] p-5 shadow-[0_10px_26px_rgba(31,36,48,0.05)]"
              data-animate-item
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-soft)]">
                    {angle.title}
                  </p>
                  <h4 className="mt-1 font-display text-[1.22rem] font-semibold tracking-[-0.03em] text-[var(--copy-strong)]">
                    {angle.angle}
                  </h4>
                </div>
                <span className="rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.14)] bg-white px-2.5 py-1 text-[11px] text-[color:var(--copy-soft)]">
                  {angle.lengths.join(" · ")}
                </span>
              </div>
              <ul className="mt-4 grid gap-3">
                {angle.hooks.map((hook) => (
                  <li
                    key={hook}
                    className="rounded-[0.55rem] border border-[rgba(56,67,84,0.1)] bg-[rgba(255,255,255,0.82)] px-4 py-3 text-sm leading-6 text-[color:var(--copy-body)]"
                  >
                    {hook}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
