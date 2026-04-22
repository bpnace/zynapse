import { SectionHeading } from "@/components/ui/section-heading";
import { campaignAngles } from "@/lib/mock-data/studio";

const quickSignals = [
  {
    label: "Briefing-Qualität",
    value: "82 Prozent vollständig",
    note: "Für bessere Routen fehlt noch die wichtigste Kaufbarriere.",
  },
  {
    label: "Empfohlenes Creative Team",
    value: "Creative Strategist, AI Producer, Prompt Specialist, Editor",
    note: "Passend für Paid Social, Reels und Short Form.",
  },
  {
    label: "Quality Check",
    value: "3 Varianten bereit für Review",
    note: "2 Varianten brauchen Anpassung.",
  },
];

export function CampaignPackPreview() {
  return (
    <section
      id="workspace-preview"
      className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Workspace Preview"
          title={
            <>
              Zynapse Core macht die <span data-animate-word>Intelligenz</span>{" "}
              im Prozess <span className="title-accent">sichtbar</span>.
            </>
          }
          copy="Im Workspace sieht euer Team nicht nur Dateien. Ihr seht Briefing-Qualität, empfohlene Kreativrouten, den Quality Check, die nächste Aktion und den Status des fertigen Media Packs."
        />
        <ul className="grid gap-2.5">
          {[
            "Briefing-Qualität mit klaren Hinweisen auf fehlende Infos",
            "Empfohlene Kreativrouten wie Problem Hook, Product Proof und Offer Push",
            "Passendes Creative Team für Strategie, Prompting, Produktion und Schnitt",
            "Quality Check vor dem Review statt blindem Varianten-Export",
            "Media Pack Status mit Hooks, Formaten und Download-Stand",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.14)] bg-white/80 px-3 py-2.5 text-[1.02rem] leading-7 font-medium text-[var(--copy-strong)] shadow-[0_6px_16px_rgba(31,36,48,0.06)]"
            >
              <span
                aria-hidden="true"
                className="mt-[0.58rem] h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="relative mt-4 lg:mt-6"
        data-parallax-window
        style={{ perspective: "1200px" }}
      >
        <div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[var(--radius-panel)]"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at 65% 35%, rgba(246,107,76,0.14) 0%, transparent 58%), radial-gradient(ellipse at 25% 75%, rgba(249,197,106,0.1) 0%, transparent 50%)",
            filter: "blur(4px)",
          }}
        />

        <div
          className="relative overflow-hidden rounded-[var(--radius-panel)] border border-[rgba(56,67,84,0.15)] shadow-[0_40px_90px_rgba(31,36,48,0.16),0_8px_24px_rgba(31,36,48,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
          style={{ transform: "rotateX(1.5deg) rotateY(-1deg)" }}
        >
          <div className="flex h-10 shrink-0 items-center gap-3 border-b border-[rgba(56,67,84,0.1)] bg-[linear-gradient(180deg,rgba(252,252,250,0.99),rgba(244,242,238,0.98))] px-4">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="block h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="block h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="block h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="font-mono text-[11px] tracking-[0.08em] text-[color:var(--copy-soft)]">
                Zynapse — Creative Flow
              </p>
            </div>
            <span
              className="font-mono text-[11px] text-[color:var(--copy-soft)] opacity-40"
              aria-hidden="true"
            >
              ⌘K
            </span>
          </div>

          <div className="grid gap-3 bg-[var(--surface-paper)] p-4 sm:p-5">
            <div className="grid gap-3 lg:grid-cols-3">
              {quickSignals.map((signal, index) => (
                <article
                  key={signal.label}
                  className={`rounded-[var(--radius-card)] border p-4 ${
                    index === 1
                      ? "section-surface-warm border-[rgba(191,106,83,0.14)]"
                      : "section-surface-paper border-[rgba(56,67,84,0.12)]"
                  }`}
                >
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    {signal.label}
                  </p>
                  <p className="mt-2 font-display text-[1.3rem] leading-[1.05] font-semibold tracking-[-0.03em] text-[var(--copy-strong)]">
                    {signal.value}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--copy-body)]">
                    {signal.note}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
              <div className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] bg-white/82 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                      Empfohlene Kreativrouten
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                      Problem Hook, Product Proof, Offer Push
                    </h3>
                  </div>
                  <span className="rounded-[var(--radius-chip)] border border-[rgba(49,125,101,0.16)] bg-[rgba(156,244,215,0.18)] px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#236851]">
                    priorisiert
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  {campaignAngles.map((angle, index) => (
                    <article
                      key={angle.title}
                      className={`rounded-[var(--radius-subcard)] border p-3 ${
                        index === 1
                          ? "border-[rgba(224,94,67,0.18)] bg-[rgba(255,240,232,0.56)]"
                          : "border-[rgba(56,67,84,0.1)] bg-[rgba(248,249,251,0.78)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                            {angle.title}
                          </p>
                          <p className="mt-1 font-display text-[1.05rem] font-semibold tracking-[-0.03em] text-[var(--copy-strong)]">
                            {angle.angle}
                          </p>
                        </div>
                        <span className="rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.12)] bg-white px-2 py-0.5 font-mono text-[9px] text-[var(--copy-soft)]">
                          {angle.lengths[0]}
                        </span>
                      </div>
                      <ul className="mt-3 grid gap-1.5">
                        {angle.hooks.slice(0, 2).map((hook) => (
                          <li
                            key={hook}
                            className="rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.08)] bg-white px-2.5 py-1.5 text-[11px] leading-5 text-[color:var(--copy-body)]"
                          >
                            {hook}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <article className="rounded-[var(--radius-card)] border border-[rgba(56,67,84,0.12)] bg-white/82 p-4">
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    Nächste Aktion
                  </p>
                  <p className="mt-2 font-display text-[1.35rem] leading-[1.05] font-semibold tracking-[-0.03em] text-[var(--copy-strong)]">
                    Bitte Route 2 freigeben
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--copy-body)]">
                    Danach werden die Product-Proof-Varianten direkt ins zentrale Review geschoben.
                  </p>
                </article>
                <article className="rounded-[var(--radius-card)] border border-[rgba(191,106,83,0.14)] bg-[rgba(255,244,236,0.82)] p-4">
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                    Media Pack Status
                  </p>
                  <p className="mt-2 font-display text-[1.35rem] leading-[1.05] font-semibold tracking-[-0.03em] text-[var(--copy-strong)]">
                    12 Assets bereit. 4 Formate. 3 Hooks.
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--copy-body)]">
                    1 Download Pack ist vorbereitet und direkt nutzbar für die Ausspielung.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
