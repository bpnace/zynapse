import { SectionHeading } from "@/components/ui/section-heading";
import { campaignAngles } from "@/lib/mock-data/studio";

const angleColors = ["var(--accent)", "var(--gold)", "var(--lavender)"] as const;

export function CampaignPackPreview() {
  return (
    <section
      className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <div className="space-y-6">
        <SectionHeading
          eyebrow="Kuratiertes Setup zuerst"
          title={
            <>
              Nicht das einzelne Asset macht den{" "}
              <span data-animate-word>Unterschied.</span> Sondern das{" "}
              <span className="title-accent">Setup dahinter</span>.
            </>
          }
          copy="Bevor produziert wird, werden Rollen, Hooks, CTA-Routen, Formate und Freigaben zusammengeführt. So wird aus einer Anfrage kein loses Asset-Bundle, sondern ein Kampagnen-Setup, das Varianten nicht dem Zufall überlässt."
        />
        <ul className="grid gap-2.5">
          {[
            "Kernbriefing mit Ziel, Offer und Guardrails",
            "Passende Rollen für Strategie, Prompting, Produktion und Review",
            "Hooks, CTA-Routen und Formatlogik pro Setup",
            "Klare Freigabepunkte statt offener Slack-Schleifen",
            "Varianten, Versionen und Handover in einem Fluss",
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

      {/* ── SaaS window frame ── */}
      <div
        className="relative mt-4 lg:mt-6"
        data-parallax-window
        style={{ perspective: "1200px" }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[var(--radius-panel)]"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at 65% 35%, rgba(246,107,76,0.14) 0%, transparent 58%), radial-gradient(ellipse at 25% 75%, rgba(249,197,106,0.1) 0%, transparent 50%)",
            filter: "blur(4px)",
          }}
        />

        {/* Window chrome */}
        <div
          className="relative overflow-hidden rounded-[var(--radius-panel)] border border-[rgba(56,67,84,0.15)] shadow-[0_40px_90px_rgba(31,36,48,0.16),0_8px_24px_rgba(31,36,48,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
          style={{ transform: "rotateX(1.5deg) rotateY(-1deg)" }}
        >
          {/* ── Title bar ── */}
          <div className="flex h-10 shrink-0 items-center gap-3 border-b border-[rgba(56,67,84,0.1)] bg-[linear-gradient(180deg,rgba(252,252,250,0.99),rgba(244,242,238,0.98))] px-4">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="block h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="block h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
              <span className="block h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
            </div>
              <div className="flex flex-1 items-center justify-center">
                <p className="font-mono text-[11px] tracking-[0.08em] text-[color:var(--copy-soft)]">
                Zynapse — Kampagnen-Setup
                </p>
              </div>
            <span
              className="font-mono text-[11px] text-[color:var(--copy-soft)] opacity-40"
              aria-hidden="true"
            >
              ⌘K
            </span>
          </div>

          {/* ── App shell ── */}
          <div className="flex" style={{ height: "460px" }}>
            {/* ── Sidebar ── */}
            <aside
              className="hidden w-40 shrink-0 flex-col border-r border-[rgba(56,67,84,0.1)] bg-[linear-gradient(180deg,rgba(249,247,244,0.99),rgba(241,239,234,0.98))] pt-3 pb-4 sm:flex"
              aria-hidden="true"
            >
              {/* Workspace */}
              <div className="px-2 pb-2">
                <div className="flex items-center gap-2 rounded-[var(--radius-chip)] bg-[rgba(246,107,76,0.09)] px-2 py-1.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[var(--accent)] text-[8px] font-bold leading-none text-white">
                    Z
                  </span>
                  <span className="truncate font-mono text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--copy-strong)]">
                    Zynapse
                  </span>
                </div>
              </div>

              {/* Nav */}
              <nav className="mt-1 flex flex-col gap-0.5 px-2">
                {[
                  { label: "Übersicht", glyph: "▦", active: false },
                  { label: "Briefing", glyph: "◈", active: false },
                  { label: "Setups", glyph: "◻", active: true },
                  { label: "Produktion", glyph: "◎", active: false },
                  { label: "Review", glyph: "✓", active: false },
                ].map(({ label, glyph, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 rounded-[var(--radius-chip)] px-2 py-[5px] text-[11px] ${
                      active
                        ? "bg-[rgba(246,107,76,0.11)] font-semibold text-[var(--accent-strong)]"
                        : "text-[color:var(--copy-soft)]"
                    }`}
                  >
                    <span className="w-3 shrink-0 text-center text-[10px] opacity-50">
                      {glyph}
                    </span>
                    <span className="truncate">{label}</span>
                  </div>
                ))}
              </nav>

              <div className="mx-3 my-3 h-px bg-[rgba(56,67,84,0.1)]" />

              {/* Pack list */}
              <div className="px-2">
                <p className="mb-1.5 px-2 font-mono text-[9px] tracking-[0.16em] uppercase text-[color:var(--copy-soft)] opacity-50">
                  Routen
                </p>
                {campaignAngles.map((a, i) => (
                  <div
                    key={a.title}
                    className="flex items-center gap-2 rounded-[var(--radius-chip)] px-2 py-[5px] text-[10px] text-[color:var(--copy-soft)]"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full opacity-70"
                      style={{ background: angleColors[i] }}
                    />
                    <span className="truncate">{a.angle}</span>
                  </div>
                ))}
              </div>

              {/* User */}
              <div className="mt-auto px-3 pt-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-[8px] font-bold leading-none text-[var(--ink-strong)]">
                    C
                  </span>
                  <span className="truncate font-mono text-[10px] text-[color:var(--copy-soft)]">
                    Kuratiertes Setup
                  </span>
                </div>
              </div>
            </aside>

            {/* ── Main panel ── */}
            <div className="relative flex min-w-0 flex-1 flex-col bg-[var(--surface-paper)]">
              {/* Toolbar */}
              <div className="flex h-[38px] shrink-0 items-center justify-between gap-3 border-b border-[rgba(56,67,84,0.09)] bg-[rgba(255,252,248,0.99)] px-4">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[color:var(--copy-soft)]">
                  <span className="opacity-60">Setups</span>
                  <span className="opacity-30">/</span>
                  <span className="font-semibold text-[var(--copy-strong)]">
                    Brand-Kampagnen-Setup
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-[var(--radius-chip)] border border-[rgba(49,125,101,0.16)] bg-[rgba(156,244,215,0.18)] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#236851]">
                    Reviewbereit
                  </span>
                  <span className="hidden font-mono text-[10px] text-[color:var(--copy-soft)] opacity-50 sm:inline">
                    3 Routen
                  </span>
                </div>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-[rgba(56,67,84,0.07)] px-4 py-2">
                <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[color:var(--copy-soft)] opacity-50">
                  Route · Hook-Richtungen
                </span>
                <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[color:var(--copy-soft)] opacity-50 text-right">
                  Längen
                </span>
                <span className="w-14 font-mono text-[9px] tracking-[0.16em] uppercase text-[color:var(--copy-soft)] opacity-50 text-right">
                  Status
                </span>
              </div>

              {/* Angle rows */}
              <div className="flex-1 overflow-hidden">
                {campaignAngles.map((angle, index) => (
                  <div
                    key={angle.title}
                    className="grid grid-cols-[1fr_auto_auto] items-start gap-3 border-b border-[rgba(56,67,84,0.07)] px-4 py-3"
                  >
                    {/* Angle + hooks */}
                    <div>
                      <div className="mb-1.5 flex items-center gap-2">
                        <span
                          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                          aria-hidden="true"
                          style={{ background: angleColors[index] }}
                        />
                        <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-[var(--accent-soft)]">
                          {angle.title}
                        </span>
                      </div>
                      <p className="mb-2 font-display text-[0.88rem] font-semibold leading-tight tracking-[-0.025em] text-[var(--copy-strong)]">
                        {angle.angle}
                      </p>
                      <div className="flex flex-col gap-1">
                        {angle.hooks.slice(0, 2).map((hook) => (
                          <div
                            key={hook}
                            className="flex items-start gap-1.5 rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.09)] bg-white px-2.5 py-1 text-[10px] leading-snug text-[color:var(--copy-body)]"
                          >
                            <span className="mt-px shrink-0 text-[8px] opacity-25">
                              ↳
                            </span>
                            {hook}
                          </div>
                        ))}
                        {angle.hooks.length > 2 && (
                          <span className="pl-1 font-mono text-[9px] text-[color:var(--copy-soft)] opacity-50">
                            +{angle.hooks.length - 2} weitere
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lengths */}
                    <div className="flex flex-col items-end gap-1 pt-0.5">
                      {angle.lengths.map((len) => (
                        <span
                          key={len}
                          className="rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.12)] bg-white px-2 py-0.5 font-mono text-[10px] text-[color:var(--copy-soft)]"
                        >
                          {len}
                        </span>
                      ))}
                    </div>

                    {/* Status */}
                    <div className="flex w-14 flex-col items-end gap-1.5 pt-0.5">
                      <span className="rounded-[var(--radius-chip)] border border-[rgba(49,125,101,0.16)] bg-[rgba(156,244,215,0.18)] px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#236851]">
                        Bereit
                      </span>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-[rgba(56,67,84,0.1)]">
                        <div className="h-full w-full rounded-full bg-[var(--mint)]" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Ghost row — peek at more content */}
                <div
                  className="grid grid-cols-[1fr_auto_auto] items-start gap-3 px-4 py-3 opacity-30"
                  aria-hidden="true"
                >
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[rgba(56,67,84,0.3)]" />
                      <div className="h-2 w-12 rounded bg-[rgba(56,67,84,0.15)]" />
                    </div>
                    <div className="mb-2 h-3 w-28 rounded bg-[rgba(56,67,84,0.15)]" />
                    <div className="h-5 w-40 rounded bg-[rgba(56,67,84,0.1)]" />
                  </div>
                  <div className="h-4 w-8 rounded bg-[rgba(56,67,84,0.1)]" />
                  <div className="h-4 w-12 rounded bg-[rgba(156,244,215,0.3)]" />
                </div>
              </div>

              {/* Bottom fade — "Ausschnitt" crop effect */}
              <div
                className="pointer-events-none absolute right-0 bottom-0 left-0 h-28"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, rgba(255,252,248,0.85) 60%, rgba(255,252,248,0.99) 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
