import { PageMotion } from "@/components/animation/page-motion";
import { JsonLdScript } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildBreadcrumbs, buildMetadata, buildPageJsonLd } from "@/lib/seo";

const pageSeo = {
  title: "Studio – Kuratiertes AI-Campaign-System für Brands und Kreative | Zynapse",
  description:
    "Zynapse verbindet Brands mit kuratierten AI-Spezialist:innen und übersetzt Briefings in markenfähige Kampagnen-Setups, Video-Varianten und klare Produktionsabläufe.",
  path: "/about",
} as const;

export const metadata = buildMetadata(pageSeo);

const heroSignals = [
  {
    label: "Für Brands",
    value: "Ein Ansprechpartner, passende AI-Spezialist:innen und ein klarer Kampagnenfluss.",
  },
  {
    label: "Für Kreative",
    value: "Kuratiertes Matching statt Kaltakquise, mit Rollen, in denen Strategie und Ausführung zusammenpassen.",
  },
  {
    label: "Ergebnis",
    value: "AI-Marketingkampagnen mit Varianten, Review-Struktur und sauberer Übergabe an Paid Social oder Content Teams.",
  },
];

type SpecialistIcon =
  | "promptEngineer"
  | "creativeDirection"
  | "promptDesign"
  | "aiProduction"
  | "aiEngineering"
  | "aiStrategy";

const specialistRoles = [
  {
    title: "Prompt Engineer",
    icon: "promptEngineer" as const,
    description:
      "Baut belastbare Generierungslogik für konsistente Visuals, Wiederholbarkeit und kontrollierbare Varianten.",
  },
  {
    title: "Creative Direction",
    icon: "creativeDirection" as const,
    description:
      "Sichert, dass die Kampagne visuell, tonal und strategisch zur Marke passt und nicht nur technisch funktioniert.",
  },
  {
    title: "Prompt Design",
    icon: "promptDesign" as const,
    description:
      "Übersetzt Kampagnenideen in kreative Prompt-Systeme, die Richtung, Stil und Variation sauber steuern.",
  },
  {
    title: "AI Production",
    icon: "aiProduction" as const,
    description:
      "Steuert Generierung, Auswahl, Feinschliff und Produktionsrhythmus über mehrere Assets und Formate hinweg.",
  },
  {
    title: "AI Engineering",
    icon: "aiEngineering" as const,
    description:
      "Verbindet Workflows, Automationen und Modell-Setups so, dass Qualität und Geschwindigkeit nicht gegeneinander arbeiten.",
  },
  {
    title: "AI Strategy",
    icon: "aiStrategy" as const,
    description:
      "Priorisiert Zielgruppen, Hooks, Testing-Routen und kreative Hebel, damit Output in echte Kampagnenleistung übersetzt wird.",
  },
];

const deliverables = [
  {
    title: "Kampagnen-Setups statt Einzelfiles",
    description:
      "Brands erhalten keine lose Sammlung an Videos, sondern ein durchdachtes Setup mit Creative Direction, Varianten-Logik und klaren Freigabepunkten.",
  },
  {
    title: "AI-Video mit System",
    description:
      "Je nach Briefing entstehen markenfähige Visuals, Sequenzen und Ads aus einem abgestimmten Modellmix, statt aus zufälligen Einzelversuchen.",
  },
  {
    title: "Handover für echte Teams",
    description:
      "Paid Social, Content und Brand Teams bekommen Assets, Versionen und Kontext so übergeben, dass direkt weitergearbeitet werden kann.",
  },
];

const valueCards = [
  {
    title: "Lean koordiniert",
    description:
      "Zynapse bündelt nur die Rollen, die für den Auftrag gebraucht werden. Das vermeidet klassische Agentur-Overheads und hält die Zusammenarbeit beweglich.",
  },
  {
    title: "Kuratiert statt beliebig",
    description:
      "Nicht jeder Auftrag braucht dasselbe Setup. Das Matching sorgt dafür, dass Brands nicht selbst erst herausfinden müssen, welche Spezialist:innen fehlen.",
  },
  {
    title: "Wiederholbar statt improvisiert",
    description:
      "Wenn Kampagnen weiterlaufen oder skaliert werden, bleibt das Produktionswissen im System. So sinkt die Reibung von Sprint zu Sprint.",
  },
];

function RoleCardIcon({ icon }: { icon: SpecialistIcon }) {
  const baseClassName =
    "pointer-events-none absolute right-[-0.55rem] bottom-[-0.45rem] h-20 w-20 text-[rgba(56,67,84,0.08)] opacity-90 transition-all duration-300 ease-out group-hover:right-[-0.4rem] group-hover:bottom-[-0.3rem] group-hover:text-[rgba(56,67,84,0.16)] sm:h-24 sm:w-24";

  switch (icon) {
    case "promptEngineer":
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={baseClassName}
        >
          <path
            d="M24 18L12 32l12 14M40 18l12 14-12 14M34 16L28 48"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "creativeDirection":
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={baseClassName}
        >
          <path
            d="M16 22v-6h12M48 22v-6H36M16 42v6h12M48 42v6H36"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="19"
            y="19"
            width="26"
            height="26"
            rx="7"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M32 25l1.8 4.9L39 32l-5.2 2.1L32 39l-1.8-4.9L25 32l5.2-2.1L32 25z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "promptDesign":
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={baseClassName}
        >
          <path
            d="M18 46l10-4 18-18-6-6-18 18-4 10z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M36 18l10 10M44 14l1 4 4 1-4 1-1 4-1-4-4-1 4-1 1-4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "aiProduction":
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={baseClassName}
        >
          <rect
            x="14"
            y="18"
            width="36"
            height="28"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M28 26l10 6-10 6V26zM18 24h4M18 40h4M42 24h4M42 40h4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "aiEngineering":
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={baseClassName}
        >
          <rect
            x="24"
            y="22"
            width="16"
            height="20"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M29 22v-4M35 22v-4M29 46v4M35 46v4M24 27h-5M24 37h-5M40 27h5M40 37h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="27" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="37" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="48" cy="27" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="48" cy="37" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M19.5 27H24M19.5 37H24M40 27h4.5M40 37h4.5M29 29h6M29 35h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "aiStrategy":
      return (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
          className={baseClassName}
        >
          <rect
            x="14"
            y="18"
            width="36"
            height="28"
            rx="6"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="22" cy="26" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="38" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M26 26h10M26 32h8M26 38h6M36 32h2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="44" cy="32" r="6.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="44" cy="32" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
}

export default function AboutPage() {
  const aboutJsonLd = buildPageJsonLd({
    ...pageSeo,
    pageType: "AboutPage",
    breadcrumbs: buildBreadcrumbs("Studio", pageSeo.path),
  });

  return (
    <>
      <JsonLdScript data={aboutJsonLd} />
      <PageMotion>
      <section
        className="mx-auto w-full max-w-7xl px-6 pt-15 pb-10 sm:px-8 lg:px-10 lg:pt-18 lg:pb-12"
        data-reveal-section
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.6fr)_minmax(21rem,0.4fr)] lg:items-start">
          <div className="space-y-6">
            <h1
              className="max-w-4xl font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-balance sm:text-6xl"
              data-animate-heading
            >
              Die <span className="title-accent">kuratierte Verbindung</span>{" "}
              zwischen Brands, AI-Spezialist:innen und markenfähiger{" "}
              <span data-animate-word>Kampagnenproduktion.</span>
            </h1>
            <p
              className="max-w-3xl text-lg leading-8 text-[color:var(--copy-body)]"
              data-animate-copy
            >
              Zynapse ist kein klassisches Studio und kein offener
              Creator-Marktplatz. Wir bringen Brands mit ausgewählten
              Spezialist:innen aus Prompt Engineering, Creative Direction,
              Prompt Design, AI Production, AI Engineering und AI Strategy
              zusammen und führen daraus einen belastbaren Kampagnenfluss.
            </p>
            <p
              className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
              data-animate-copy
            >
              So entsteht professionelle AI-Marketingproduktion mit klaren
              Rollen, kontrollierten Reviews und Varianten, die nicht nur gut
              aussehen, sondern in echten Marketing-Setups weiterverwendet,
              getestet und ausgesteuert werden können.
            </p>
            <div className="flex flex-wrap gap-3" data-animate-item>
              <ButtonLink href="/request" size="lg">
                Brand-Anfrage
              </ButtonLink>
              <ButtonLink href="/apply" variant="secondary" size="lg">
                Bewerbung für Kreative
              </ButtonLink>
            </div>
          </div>

          <aside className="grid gap-3">
            {heroSignals.map((signal, index) => (
              <div
                key={signal.label}
                className={`section-card rounded-[var(--radius-card)] p-5 ${
                  index === 0
                    ? "section-surface-warm border-[rgba(191,106,83,0.16)]"
                    : index === 1
                      ? "section-surface-paper"
                      : "section-surface-contrast"
                }`}
              >
                <p className="text-[0.72rem] leading-4 font-medium tracking-[0.12em] text-[color:var(--copy-muted)] uppercase">
                  {signal.label}
                </p>
                <p className="mt-2 font-display text-[1.32rem] leading-[1.02] tracking-[-0.04em] text-[var(--copy-strong)]">
                  {signal.value}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-start">
          <SectionHeading
            eyebrow="Kuratiertes Netzwerk"
            title={
              <>
                Die Rollen hinter starker <span className="title-accent">AI-Kreativarbeit</span>.
              </>
            }
            copy="Brands sollen nicht erst selbst Teams zusammenpuzzeln. Zynapse baut die passende Kombination aus Spezialist:innen rund um die Aufgabe, die Marke und den gewünschten Kampagnenrhythmus."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {specialistRoles.map((role) => (
              <article
                key={role.title}
                className="group section-card section-surface-paper relative isolate overflow-hidden rounded-[var(--radius-card)] p-5"
              >
                <RoleCardIcon icon={role.icon} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(224,94,67,0.05),rgba(224,94,67,0)_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <h3 className="relative font-display text-[1.28rem] leading-[1.02] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                  {role.title}
                </h3>
                <p className="relative mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
                  {role.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-warm rounded-[calc(var(--radius-panel)+0.08rem)] border-[rgba(191,106,83,0.16)] p-7 sm:p-9">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-start">
            <div className="space-y-5">
              <span className="eyebrow" data-animate-heading>
                Was Brands am Ende bekommen
              </span>
              <h2
                className="max-w-3xl font-display text-4xl leading-[0.94] font-semibold tracking-[-0.06em] text-[var(--copy-strong)] sm:text-5xl"
                data-animate-heading
              >
                Aus Matching wird <span data-animate-word>Output</span> mit{" "}
                <span className="title-accent">Kampagnenrelevanz</span>.
              </h2>
              <p
                className="max-w-2xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]"
                data-animate-copy
              >
                Zynapse übersetzt das Know-how der beteiligten Spezialist:innen
                in Assets, Varianten und Entscheidungsgrundlagen, die mit dem
                restlichen Marketing-Team funktionieren. Nicht nur im Pitch,
                sondern im operativen Alltag.
              </p>
            </div>

            <div className="grid gap-3">
              {deliverables.map((item, index) => (
                <article
                  key={item.title}
                  className={`section-card rounded-[var(--radius-card)] p-5 ${
                    index === 1 ? "section-surface-contrast" : "section-surface-paper"
                  }`}
                >
                  <h3 className="font-display text-[1.4rem] leading-[1.02] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--copy-body)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <SectionHeading
          eyebrow="Warum dieses Modell funktioniert"
          title={
            <>
              Weniger <span data-animate-word>Overhead</span>, mehr{" "}
              <span className="title-accent">bewegliche Zusammenarbeit</span>.
            </>
          }
          copy="Die Stärke von Zynapse liegt nicht in maximaler Größe, sondern in sauberer Orchestrierung. Das hält Produktionen näher an der Marke, näher am Briefing und wirtschaftlicher im laufenden Betrieb."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {valueCards.map((item, index) => (
            <article
              key={item.title}
              className={`section-card rounded-[var(--radius-card)] p-6 ${
                index === 0
                  ? "section-surface-contrast"
                  : index === 1
                    ? "section-surface-paper"
                    : "section-surface-warm border-[rgba(191,106,83,0.14)]"
              }`}
            >
              <h3 className="font-display text-[1.45rem] leading-[1.02] font-semibold tracking-[-0.04em] text-[var(--copy-strong)]">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.95rem] leading-7 text-[color:var(--copy-body)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-10"
        data-reveal-section
      >
        <div className="section-card section-surface-contrast rounded-[calc(var(--radius-panel)+0.1rem)] p-7 sm:p-9">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <h2
                className="max-w-3xl font-display text-3xl font-semibold tracking-[-0.05em] text-[var(--copy-strong)] sm:text-4xl"
                data-animate-heading
              >
                <span data-animate-word>Bereit</span> für den nächsten{" "}
                <span className="title-accent">Schritt</span>?
              </h2>
              <p
                className="max-w-xl text-base leading-7 text-[color:var(--copy-body)]"
                data-animate-copy
              >
                Ob als Brand oder Kreative:r: Der Einstieg bleibt kompakt. Ihr
                bringt Briefing oder Profil mit, Zynapse prüft Match und
                Produktionsfit.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/request" size="lg">
                Brand-Anfrage
              </ButtonLink>
              <ButtonLink href="/apply" variant="secondary" size="lg">
                Bewerbung für Kreative
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
      </PageMotion>
    </>
  );
}
