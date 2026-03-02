import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";
import { campaignAngles, studioTimeline, videoVariants } from "@/lib/mock-data/studio";

export const metadata = buildMetadata({
  title: "Studio | Zynapse",
  description:
    "Das Zynapse Studio visualisiert, wie aus einer Marken-Anfrage ein Kampagnen-Pack und daraus skalierter Video-Output wird.",
  path: "/studio",
});

export default function StudioPage() {
  return (
    <>
      <PageHero
        label="Studio"
        title="Der geführte Flow von Anfrage zu Kampagnenlogik zu Varianten."
        description="Das Studio ist in v1 eine produktnahe Demo-Oberfläche. Es zeigt nicht jeden internen Schritt, sondern macht sichtbar, wie Briefing, Kampagnenstruktur und Output zusammenhängen."
        badges={["Eingabe", "Kampagnen-Pack", "Freigabe", "Export"]}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-6 py-10 sm:px-8 lg:grid-cols-3 lg:px-10">
        {studioTimeline.map((item) => (
          <article key={item.title} className="section-card rounded-[1.8rem] p-6">
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--accent-soft)]">
              {item.title}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em]">
              {item.detail}
            </h2>
          </article>
        ))}
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:px-10">
        <div className="section-card rounded-[2rem] p-7">
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-muted)]">
            Kampagnen-Struktur
          </p>
          <div className="mt-6 space-y-4">
            {campaignAngles.map((angle) => (
              <div
                key={angle.title}
                className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/[0.04] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[var(--gold)]">
                      {angle.title}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-semibold">{angle.angle}</h3>
                  </div>
                  <Badge tone="mint">{angle.lengths.join(" / ")}</Badge>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[color:var(--copy-muted)]">
                  {angle.hooks.map((hook) => (
                    <li key={hook}>{hook}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="section-card rounded-[2rem] p-7">
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--copy-muted)]">
            Output-Board
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {videoVariants.slice(0, 8).map((variant) => (
              <article
                key={variant.id}
                className="rounded-[1.5rem] border border-[color:var(--line)] bg-black/20 p-4"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--copy-muted)]">
                  {variant.angle}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold tracking-[-0.03em]">
                  {variant.hookTitle}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{variant.format}</Badge>
                  <Badge tone="accent">{variant.length}</Badge>
                  <Badge tone="mint">{variant.objective}</Badge>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-12 sm:px-8 lg:px-10">
        <div>
          <p className="font-display text-3xl font-semibold tracking-[-0.05em]">
            Studio-Demo gesehen. Jetzt den echten Intake starten.
          </p>
          <p className="mt-2 text-[color:var(--copy-muted)]">
            Der Brand Wizard übergibt sauber an den nächsten operativen Schritt.
          </p>
        </div>
        <ButtonLink href="/request" size="lg">
          Anfrage starten
        </ButtonLink>
      </section>
    </>
  );
}
