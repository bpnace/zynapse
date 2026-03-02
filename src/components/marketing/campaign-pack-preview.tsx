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
          title="Der Differenzierer ist nicht das Video. Es ist das Kampagnen-Pack davor."
          copy="Zynapse verkauft keine isolierten Clips. Jede Anfrage wird zuerst in Angles, Hooks, CTA-Varianten, Cuts und Längen übersetzt. Dadurch wird Video-Output planbar und testbar."
        />
        <ul className="space-y-3 text-[color:var(--copy-muted)]">
          <li data-animate-copy>3 Angles pro Pack</li>
          <li data-animate-copy>10 Hook-Richtungen pro Kampagne</li>
          <li data-animate-copy>5 CTA-Varianten pro Offer</li>
          <li data-animate-copy>6 Video Cuts pro Angle</li>
          <li data-animate-copy>3 Längen für Platzierung und Testing</li>
        </ul>
      </div>
      <div className="section-card rounded-[2rem] p-6" data-animate-item>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-muted)]">
              Beispiel-Kampagnen-Pack
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em]">
              Creative-Testing-Struktur
            </h3>
          </div>
          <span className="rounded-full bg-[rgba(156,244,215,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mint)]">
            Freigabebereit
          </span>
        </div>
        <div className="mt-6 grid gap-4">
          {campaignAngles.map((angle) => (
            <article
              key={angle.title}
              className="rounded-[1.5rem] border border-[color:var(--line)] bg-black/20 p-5"
              data-animate-item
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-soft)]">
                    {angle.title}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold tracking-[-0.03em]">
                    {angle.angle}
                  </h4>
                </div>
                <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-xs text-[color:var(--copy-muted)]">
                  {angle.lengths.join(" · ")}
                </span>
              </div>
              <ul className="mt-4 grid gap-3">
                {angle.hooks.map((hook) => (
                  <li
                    key={hook}
                    className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-[color:var(--copy-muted)]"
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
