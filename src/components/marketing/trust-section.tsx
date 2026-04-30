import { AnimatedMetric } from "@/components/marketing/animated-metric";
import { ButtonLink } from "@/components/ui/button";
import { trustSignals } from "@/lib/content/site";

const auditItems = [
  { label: "Markenregeln", value: "aktiv", accent: false },
  { label: "Review-Threads", value: 3, suffix: " offen", accent: true },
  { label: "Freigaben", value: 12, suffix: " final", accent: true },
  { label: "Delivery Pack", value: "bereit", accent: false },
] as const;

export function TrustSection() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-10"
      data-reveal-section
      data-stagger="dense"
    >
      <div className="overflow-hidden rounded-[0.55rem] border border-[rgba(56,67,84,0.18)] bg-white shadow-[0_18px_42px_rgba(31,36,48,0.07)]">
        <div className="grid gap-8 border-b border-[rgba(56,67,84,0.12)] px-6 py-7 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,0.54fr)_minmax(0,0.46fr)]">
          <div className="space-y-5">
            <p
              className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]"
              data-animate-heading
            >
              Vertrauen & Kontrolle
            </p>
            <h2
              className="max-w-3xl font-display text-4xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance text-[var(--copy-strong)] sm:text-[3.25rem]"
              data-animate-heading
            >
              KI Creatives, die <span className="title-accent">kontrollierbar</span>{" "}
              bleiben.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)]">
              Nicht nur mehr Output, sondern klare Freigaben, sichtbare
              Markenregeln und ein nachvollziehbarer Review-Status für jede
              Version.
            </p>
          </div>

          <div
            className="grid gap-5 border-t border-[rgba(56,67,84,0.12)] pt-5 sm:grid-cols-2"
            data-animate-item
          >
            {auditItems.map((item, index) => (
              <article
                key={item.label}
                className={`min-w-0 ${
                  index > 1 ? "border-t border-[rgba(56,67,84,0.12)] pt-5" : ""
                } ${index % 2 === 1 ? "sm:border-l sm:border-[rgba(56,67,84,0.12)] sm:pl-5" : ""}`}
              >
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--copy-soft)]">
                  {item.label}
                </p>
                <div className="mt-2 space-y-1.5">
                  <p
                    className={`font-display text-[2rem] leading-[0.92] font-semibold tracking-[-0.05em] ${
                      item.accent
                        ? "text-[var(--accent-strong)]"
                        : "text-[var(--copy-strong)]"
                    }`}
                  >
                    {typeof item.value === "number" ? (
                      <AnimatedMetric
                        value={item.value}
                        suffix={item.suffix}
                        className={item.accent ? "text-[var(--accent-strong)]" : undefined}
                      />
                    ) : (
                      item.value
                    )}
                  </p>
                  <p className="text-sm leading-6 text-[color:var(--copy-body)]">
                    {item.label === "Markenregeln"
                      ? "Claims, No-Gos und Stilvorgaben laufen sichtbar mit."
                      : item.label === "Review-Threads"
                        ? "Feedback bleibt gebündelt statt in verschiedenen Tools zu landen."
                        : item.label === "Freigaben"
                          ? "Finale Varianten sind pro Status klar nachvollziehbar."
                          : "Bereit für die saubere Übergabe ans Media Team."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4">
          {trustSignals.map((signal, index) => (
            <article
              key={signal.title}
              className={`relative overflow-hidden px-6 py-6 sm:px-8 xl:px-6 ${
                index > 0 ? "border-t border-[rgba(56,67,84,0.12)] md:border-t-0" : ""
              } ${
                index % 2 === 1 ? "md:border-l md:border-[rgba(56,67,84,0.12)] xl:border-l-0" : ""
              } ${
                index > 1 ? "xl:border-l xl:border-[rgba(56,67,84,0.12)]" : ""
              } ${index === 1 ? "bg-[var(--copy-strong)]" : "bg-white"}`}
              data-animate-item
            >
              <div className="relative z-10 space-y-4">
                <span
                  className={`font-mono text-[11px] tracking-[0.16em] uppercase ${
                    index === 1 ? "text-white/56" : "text-[var(--copy-soft)]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  className={`font-display text-[1.5rem] leading-[0.98] font-semibold tracking-[-0.04em] ${
                    index === 1 ? "text-white" : "text-[var(--copy-strong)]"
                  }`}
                >
                  {signal.title}
                </h3>
                <p
                  className={`text-[0.98rem] leading-7 ${
                    index === 1 ? "text-white/74" : "text-[color:var(--copy-body)]"
                  }`}
                >
                  {signal.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-[rgba(56,67,84,0.12)] px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-[color:var(--copy-body)]">
            Alle Entscheidungen bleiben pro Variante nachvollziehbar. So sieht
            euer Team nicht nur das Ergebnis, sondern auch, warum es
            freigegeben wurde.
          </p>
          <ButtonLink href="/legal/privacy" variant="secondary" size="lg">
            Datenschutz ansehen
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
