import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { heroMetrics } from "@/lib/content/site";
import { campaignAngles, videoVariants } from "@/lib/mock-data/studio";

const reviewQueue = [
  {
    title: "Hook-Stack",
    detail: "Pain-first Intros priorisiert für kalte Zielgruppen-Tests.",
  },
  {
    title: "Angebots-Framing",
    detail: "Starter-Bundle-CTA fixiert über alle Conversion-Cuts.",
  },
  {
    title: "Marken-Leitplanken",
    detail: "Claims und Belege geprüft vor finalem Export.",
  },
] as const;

/* ─── Inline SVG icons (13×13, stroke-based) ─── */
function IconGrid() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}
function IconVideo() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
function IconCheckSmall() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const objectiveColors: Record<string, { bar: string; bg: string; cls: string }> = {
  Conversion: { bar: "var(--accent)", bg: "rgba(246,107,76,0.08)", cls: "bg-[var(--accent)]" },
  Awareness: { bar: "var(--lavender)", bg: "rgba(185,178,255,0.1)", cls: "bg-[var(--lavender)]" },
  Retention: { bar: "var(--mint)", bg: "rgba(156,244,215,0.12)", cls: "bg-[var(--mint)]" },
};

const aspectMap: Record<string, string> = {
  "9:16": "w-7 h-12",
  "1:1": "w-10 h-10",
  "4:5": "w-9 h-11",
};

export function Hero() {
  const sampleVariants = videoVariants.slice(0, 4);
  const sampleAngles = campaignAngles.slice(0, 2);

  return (
    <section
      className="shadow-bottom relative left-1/2 w-screen max-w-none -translate-x-1/2 -mt-28 pb-14"
      data-hero
    >
      <div className="relative min-h-[50rem] overflow-hidden">
        <div className="pointer-events-none absolute inset-0" />

        {/* ═══ DEMO UI PANEL (behind intro) ═══ */}
        <div className="absolute inset-0" data-hero-panel>
          <div className="flex h-full min-h-[50rem] pt-2 flex-col">

            {/* ─── App Bar ─── */}
            <div className="flex items-center justify-between border-b border-[rgba(34,42,55,0.1)] bg-[rgba(255,255,255,0.45)] px-4 py-2.5 backdrop-blur-[10px]">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center bg-[var(--accent)] text-[9px] font-bold text-white">
                  Z
                </div>
                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#1f2633]">
                  Zynapse
                </span>
                <span className="text-[rgba(31,40,53,0.2)]">/</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[rgba(60,70,86,0.54)]">
                  Paid-Social-Launch
                </span>
                <span className="bg-[rgba(156,244,215,0.22)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#1f7a60]">
                  Freigabebereit
                </span>
              </div>
              <div className="hidden items-center gap-2.5 sm:flex">
                <div className="flex items-center gap-1.5 rounded-md border border-[rgba(31,40,53,0.1)] bg-[rgba(255,255,255,0.6)] px-2.5 py-1">
                  <IconSearch />
                  <span className="font-mono text-[10px] text-[rgba(60,70,86,0.42)]">Suchen...</span>
                  <span className="ml-2 bg-[rgba(31,40,53,0.06)] px-1 text-[9px] text-[rgba(60,70,86,0.38)]">⌘K</span>
                </div>
                <div className="relative text-[rgba(60,70,86,0.5)]">
                  <IconBell />
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                </div>
                <div className="flex -space-x-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[var(--lavender)] text-[8px] font-bold text-[#5c52cc]">MK</div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[var(--gold)] text-[8px] font-bold text-[#9a6b00]">TL</div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[rgba(246,107,76,0.18)] text-[8px] font-bold text-[var(--accent-soft)]">SP</div>
                </div>
              </div>
            </div>

            {/* ─── Body: Sidebar + Content ─── */}
            <div className="grid flex-1 xl:grid-cols-[11rem_minmax(0,1fr)_15.5rem]">

              {/* ─── Left Sidebar ─── */}
              <nav className="hidden flex-col gap-0.5 border-r border-[rgba(31,40,53,0.08)] bg-[rgba(249,246,241,0.5)] px-2 py-3 xl:flex">
                <p className="mb-1 px-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[rgba(60,70,86,0.38)]">
                  Workspace
                </p>
                <div className="flex items-center gap-2 rounded-sm bg-[rgba(246,107,76,0.09)] px-2.5 py-1.5 text-xs font-medium text-[var(--accent-soft)]">
                  <IconGrid /> Kampagnen
                </div>
                <div className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-xs text-[rgba(60,70,86,0.66)]">
                  <IconVideo /> Varianten
                </div>
                <div className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-xs text-[rgba(60,70,86,0.66)]">
                  <IconCheck /> Freigaben
                </div>
                <div className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-xs text-[rgba(60,70,86,0.66)]">
                  <IconChart /> Performance
                </div>

                <div className="my-2 h-px bg-[rgba(31,40,53,0.07)]" />

                <p className="mb-1 px-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[rgba(60,70,86,0.38)]">
                  Export
                </p>
                <div className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-xs text-[rgba(60,70,86,0.66)]">
                  <div className="flex items-center gap-2">
                    <IconUpload /> TikTok
                  </div>
                  <span className="font-mono text-[9px] text-[rgba(60,70,86,0.45)]">94%</span>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-xs text-[rgba(60,70,86,0.66)]">
                  <div className="flex items-center gap-2">
                    <IconUpload /> Meta Ads
                  </div>
                  <span className="font-mono text-[9px] text-[rgba(60,70,86,0.45)]">91%</span>
                </div>
              </nav>

              {/* ─── Center Column ─── */}
              <div className="flex flex-col">

                {/* Tab Bar */}
                <div className="flex items-center justify-between border-b border-[rgba(31,40,53,0.07)] bg-[rgba(255,255,255,0.25)] px-4">
                  <div className="flex items-end">
                    <button className="border-b-2 border-[var(--accent)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent-soft)]">
                      Pack-Übersicht
                    </button>
                    <button className="border-b-2 border-transparent px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[rgba(60,70,86,0.45)]">
                      Hooks
                    </button>
                    <button className="border-b-2 border-transparent px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[rgba(60,70,86,0.45)]">
                      Export-Queue
                    </button>
                  </div>
                  <div className="hidden items-center gap-1.5 pb-1 sm:flex">
                    <div className="flex items-center gap-1 border border-[rgba(31,40,53,0.1)] px-2 py-1 text-[10px] text-[rgba(60,70,86,0.56)]">
                      <IconFilter />
                      <span>Alle Angles</span>
                    </div>
                    <div className="rounded-md bg-[var(--accent)] px-2.5 py-1 text-[10px] font-semibold text-white">
                      + Export starten
                    </div>
                  </div>
                </div>

                {/* Scrollable content */}
                <div className="grid flex-1 gap-3 overflow-auto p-3">

                  {/* ── Kampagnen-Pack (table-style) ── */}
                  <section className="border border-[rgba(31,40,53,0.08)] bg-[rgba(249,246,241,0.78)] shadow-[0_4px_16px_rgba(31,36,48,0.06)] backdrop-blur-[10px]">
                    <div className="flex items-center justify-between border-b border-[rgba(31,40,53,0.07)] px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[rgba(60,70,86,0.5)]">
                          Kampagnen-Pack
                        </span>
                        <span className="bg-[rgba(31,40,53,0.07)] px-1.5 py-0.5 font-mono text-[9px] text-[rgba(60,70,86,0.55)]">
                          {sampleAngles.length} Angles
                        </span>
                      </div>
                      <span className="bg-[rgba(156,244,215,0.22)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#1f7a60]">
                        Bereit zur Freigabe
                      </span>
                    </div>

                    {/* Column headers */}
                    <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-[rgba(31,40,53,0.06)] px-4 py-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[rgba(60,70,86,0.36)]">Angle</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[rgba(60,70,86,0.36)]">Hooks</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[rgba(60,70,86,0.36)]">Längen</span>
                    </div>

                    {/* Angle rows */}
                    {sampleAngles.map((angle, i) => (
                      <div
                        key={angle.title}
                        className={`px-4 py-3 ${i === 0 ? "bg-[rgba(246,107,76,0.035)]" : ""} ${i < sampleAngles.length - 1 ? "border-b border-[rgba(31,40,53,0.06)]" : ""}`}
                      >
                        <div className="grid grid-cols-[1fr_auto_auto] items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                              <p className="text-xs font-semibold text-[#1f2633]">{angle.angle}</p>
                              <span className="font-mono text-[9px] text-[rgba(60,70,86,0.4)]">{angle.title}</span>
                            </div>
                            <div className="mt-2 ml-3.5 space-y-1">
                              {angle.hooks.map((hook) => (
                                <div key={hook} className="flex items-center gap-1.5">
                                  <div className="h-px w-3 bg-[rgba(31,40,53,0.15)]" />
                                  <span className="text-[11px] text-[#657083]">{hook}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex h-5 items-end gap-0.5">
                              {[60, 80, 90, 70, 85, 75].map((h, idx) => (
                                <div
                                  key={idx}
                                  className="w-1 bg-[rgba(246,107,76,0.35)]"
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                            <span className="font-mono text-[9px] text-[rgba(60,70,86,0.5)]">{angle.hooks.length} Hooks</span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {angle.lengths.map((l) => (
                              <span key={l} className="bg-[rgba(31,40,53,0.06)] px-1.5 py-0.5 font-mono text-[9px] text-[rgba(60,70,86,0.7)]">
                                {l}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>

                  {/* ── Output-Board (thumbnail grid) ── */}
                  <section className="border border-[rgba(31,40,53,0.08)] bg-[rgba(249,246,241,0.78)] shadow-[0_4px_16px_rgba(31,36,48,0.06)] backdrop-blur-[10px]">
                    <div className="flex items-center justify-between border-b border-[rgba(31,40,53,0.07)] px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[rgba(60,70,86,0.5)]">
                          Output-Board
                        </span>
                        <span className="bg-[rgba(31,40,53,0.07)] px-1.5 py-0.5 font-mono text-[9px] text-[rgba(60,70,86,0.55)]">
                          {sampleVariants.length} Varianten
                        </span>
                      </div>
                      <Badge tone="accent">Kurzformat-Export</Badge>
                    </div>

                    <div className="grid gap-2.5 p-3 md:grid-cols-2">
                      {sampleVariants.map((variant) => {
                        const oc = objectiveColors[variant.objective] ?? objectiveColors.Conversion;
                        const ar = aspectMap[variant.format] ?? "w-10 h-10";

                        return (
                          <article
                            key={variant.id}
                            className="flex items-start gap-3 border border-[rgba(31,40,53,0.07)] bg-white p-2.5 shadow-[0_2px_8px_rgba(31,36,48,0.06)]"
                            style={{ borderLeftWidth: "2.5px", borderLeftColor: oc.bar }}
                          >
                            {/* Thumbnail placeholder */}
                            <div className={`shrink-0 ${ar} relative overflow-hidden bg-[rgba(31,40,53,0.07)] flex items-center justify-center`}>
                              <div className="flex h-full items-end gap-px px-0.5 py-1">
                                {[40, 70, 55, 85, 60, 90, 45, 75, 65, 80].map((h, idx) => (
                                  <div
                                    key={idx}
                                    className="flex-1"
                                    style={{ height: `${h}%`, background: oc.bar, opacity: 0.4 }}
                                  />
                                ))}
                              </div>
                              <span className="absolute bottom-0.5 left-0 right-0 text-center font-mono text-[7px] text-white/80">
                                {variant.format}
                              </span>
                            </div>

                            {/* Text content */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-[rgba(60,70,86,0.45)]">
                                  {variant.angle}
                                </span>
                                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${oc.cls}`} />
                              </div>
                              <h3 className="mt-0.5 text-xs font-semibold leading-tight tracking-[-0.02em] text-[#1f2633]">
                                {variant.hookTitle}
                              </h3>
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span className="bg-[rgba(31,40,53,0.07)] px-1.5 py-0.5 font-mono text-[9px] text-[rgba(60,70,86,0.65)]">
                                  {variant.length}
                                </span>
                                <span
                                  className="px-1.5 py-0.5 font-mono text-[9px]"
                                  style={{ background: oc.bg, color: oc.bar }}
                                >
                                  {variant.objective}
                                </span>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>

              {/* ─── Right Sidebar (Freigabe-Spur) ─── */}
              <aside className="border-l border-[rgba(31,40,53,0.08)] bg-[rgba(244,240,233,0.6)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[rgba(31,40,53,0.08)] px-3.5 py-2.5">
                  <div className="flex items-center gap-2 text-[rgba(60,70,86,0.5)]">
                    <IconCheck />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                      Freigabe-Spur
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] font-semibold text-[#1f7a60]">3</span>
                    <span className="font-mono text-[10px] text-[rgba(60,70,86,0.38)]">/</span>
                    <span className="font-mono text-[10px] text-[rgba(60,70,86,0.38)]">3 fertig</span>
                  </div>
                </div>

                {/* Overall progress bar */}
                <div className="px-3.5 pt-2.5 pb-1">
                  <div className="h-1 rounded-full bg-[rgba(31,40,53,0.08)]">
                    <div className="h-full w-full rounded-full bg-[linear-gradient(90deg,var(--mint),#4ecfaa)]" />
                  </div>
                </div>

                {/* Review queue */}
                <div className="space-y-1.5 p-2">
                  {reviewQueue.map((item, i) => (
                    <div
                      key={item.title}
                      className="border border-[rgba(31,40,53,0.07)] bg-white px-3 py-2.5 shadow-[0_2px_6px_rgba(31,36,48,0.05)]"
                      style={{ borderLeftWidth: "2.5px", borderLeftColor: "var(--mint)" }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[9px] text-[rgba(60,70,86,0.38)]">
                            0{i + 1}
                          </span>
                          <p className="mt-0.5 text-xs font-semibold text-[#1f2633]">
                            {item.title}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 bg-[rgba(156,244,215,0.22)] px-1.5 py-0.5 text-[#1f7a60]">
                          <IconCheckSmall />
                          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em]">
                            fertig
                          </span>
                        </div>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-[1.5] text-[#8898aa]">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="mx-3 my-1 h-px bg-[rgba(31,40,53,0.07)]" />

                {/* Export Status */}
                <div className="p-3">
                  <div className="border border-[rgba(31,40,53,0.07)] bg-white p-3 shadow-[0_2px_6px_rgba(31,36,48,0.05)]">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[rgba(60,70,86,0.48)]">
                        Export-Status
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--mint)]" />
                        <span className="font-mono text-[9px] text-[#1f7a60]">läuft</span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2.5">
                      {[
                        { label: "TikTok 9:16", width: "94%", color: "var(--accent)" },
                        { label: "Meta 4:5", width: "91%", color: "var(--lavender)" },
                        { label: "Reels 1:1", width: "89%", color: "var(--gold)" },
                      ].map(({ label, width, color }) => (
                        <div key={label}>
                          <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5" style={{ background: color }} />
                              <span className="text-[11px] text-[#657083]">{label}</span>
                            </div>
                            <span className="font-mono text-[10px] font-medium text-[#1f2633]">{width}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[rgba(31,40,53,0.08)]">
                            <div
                              className="h-full rounded-full"
                              style={{ width, background: color, opacity: 0.75 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Metric footer */}
                    <div className="mt-3 grid grid-cols-3 divide-x divide-[rgba(31,40,53,0.07)] border-t border-[rgba(31,40,53,0.07)] pt-2.5">
                      {[
                        { value: "18", label: "Varianten" },
                        { value: "6", label: "Formate" },
                        { value: "3", label: "Angles" },
                      ].map(({ value, label }) => (
                        <div key={label} className="px-2 text-center first:pl-0 last:pr-0">
                          <p className="font-mono text-sm font-semibold text-[#1f2633]">{value}</p>
                          <p className="font-mono text-[9px] text-[rgba(60,70,86,0.45)]">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* ═══ HERO INTRO (glassmorphic overlay — unchanged) ═══ */}
        <div
          className="relative z-10 min-h-[50rem] px-0 py-0"
          data-hero-intro
        >
          <div className="h-full w-full lg:absolute lg:inset-y-0 lg:left-0 lg:w-[54%]">
            <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(255,255,255,0.1))] px-6 pt-32 pb-8 shadow-[18px_0_50px_rgba(31,36,48,0.08)] backdrop-blur-[15px] sm:px-8 sm:pt-36 sm:pb-8 lg:px-10 lg:pt-36 lg:pb-10">
              <div className="space-y-5">
                <span className="eyebrow">Produktionssystem für Videokampagnen</span>
                <div className="space-y-4">
                  <h1 className="max-w-3xl font-display text-5xl leading-[0.88] font-semibold tracking-[-0.07em] text-balance sm:text-6xl lg:text-[4.95rem]">
                    Vom Briefing zur{" "}
                    <span className="text-gradient">fertigen Videokampagne</span>.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-[color:var(--copy-muted)] sm:text-lg sm:leading-8">
                    Marken definieren Produkt, Ziel, Stil und Budget. Social Media Manager
                    übersetzen das in Kampagnenlogik. Zynapse Studio skaliert daraus ein
                    sichtbares Kampagnen-Board mit freigabebereiten Varianten für TikTok,
                    Reels und Shorts.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/request" size="lg">
                    Kampagne anfragen
                  </ButtonLink>
                  <ButtonLink href="/apply" variant="secondary" size="lg">
                    Als Social Media Manager beitreten
                  </ButtonLink>
                </div>
              </div>

              <div className="grid gap-3 pt-8 sm:grid-cols-3 lg:pt-12">
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-sm bg-white/82 px-5 py-4 shadow-[0_12px_28px_rgba(31,36,48,0.06)]"
                    data-hero-metric
                  >
                    <p className="font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--accent)]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--copy-muted)]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none h-[50rem] lg:hidden" />
        </div>
      </div>
    </section>
  );
}
