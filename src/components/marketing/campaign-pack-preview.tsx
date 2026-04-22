import Image from "next/image";
import { AnimatedMetric } from "@/components/marketing/animated-metric";
import { SectionHeading } from "@/components/ui/section-heading";

const workspaceHighlights = [
  "Fehlende Briefing-Infos werden vor der Produktion sichtbar.",
  "Kreativrouten werden nach Hook, Format und CTA priorisiert.",
  "Offene Threads bleiben im zentralen Review gebündelt.",
  "Assets sind nach Hook, Format und Version sortiert.",
  "Review und Media Pack bleiben in einem klaren Flow zusammen.",
];

type WorkspaceStat = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  title: string;
  detail: string;
};

const workspaceStats: WorkspaceStat[] = [
  {
    label: "Briefing-Qualität",
    value: 88,
    suffix: "%",
    title: "vollständig",
    detail: "Genug Kontext für starke Routen, bevor die Produktion startet.",
  },
  {
    label: "Nächste Aktion",
    value: 2,
    prefix: "Route ",
    title: "freigeben",
    detail: "Danach kann der finale Export direkt ins Delivery Pack gehen.",
  },
  {
    label: "Media Pack",
    value: 12,
    suffix: " Assets",
    title: "bereit",
    detail: "3 offene Review-Threads, klare Delivery für das Media Team.",
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
        <ul className="grid max-w-[34rem] gap-2">
          {workspaceHighlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-[var(--radius-chip)] border border-[rgba(56,67,84,0.14)] bg-white/78 px-3 py-2 text-[0.92rem] leading-6 font-medium text-[var(--copy-strong)] shadow-[0_6px_16px_rgba(31,36,48,0.06)]"
            >
              <span
                aria-hidden="true"
                className="mt-[0.48rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
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
          <Image
            src="/marketing/workspace-preview.png"
            alt="Screenshot des Zynapse Brand Workspace mit Sidebar, Kampagnenübersicht, Review-Status und nächster Aktion."
            width={1600}
            height={1200}
            className="h-auto w-full object-cover object-top"
            priority
          />
        </div>

        <div className="mt-5 grid gap-5 border-t border-[rgba(56,67,84,0.12)] pt-5 sm:grid-cols-3">
          {workspaceStats.map((item, index) => (
            <article
              key={item.label}
              className={`min-w-0 ${index > 0 ? "sm:border-l sm:border-[rgba(56,67,84,0.12)] sm:pl-5" : ""}`}
              data-animate-item
            >
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                {item.label}
              </p>
              <div className="mt-2 space-y-1.5">
                <p className="font-display text-[2.4rem] leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
                  <AnimatedMetric
                    value={item.value}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    className="text-[var(--accent-strong)]"
                  />
                </p>
                <p className="font-display text-[1.12rem] leading-[1.05] font-semibold tracking-[-0.03em] text-[var(--copy-strong)]">
                  {item.title}
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--copy-body)]">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
