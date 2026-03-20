import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Impressum | Zynapse",
  description:
    "Anbieterkennzeichnung und rechtliche Informationen zu Zynapse und Codariq.",
  path: "/legal/imprint",
  indexable: false,
});

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-[color:var(--line)] pt-6 sm:pt-7">
      <h2 className="font-display text-2xl leading-[1] font-semibold tracking-[-0.045em] text-[var(--copy-strong)] sm:text-[2rem]">
        {title}
      </h2>
      <div className="max-w-3xl space-y-4 text-base leading-7 text-[color:var(--copy-body)]">
        {children}
      </div>
    </section>
  );
}

export default function ImprintPage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pt-15 pb-16 sm:px-8">
      <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
        Anbieterkennzeichnung
      </h1>
      <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]">
        Zynapse ist ein Angebot von Codariq. Verantwortlicher Anbieter dieser
        Website im Sinne von § 5 DDG und § 18 Abs. 2 MStV ist
        Tarik Arthur Marshall, handelnd unter Codariq.
      </p>

      <LegalSection title="Angaben gemäß § 5 DDG">
        <p>
          Tarik Arthur Marshall
          <br />
          handelnd unter Codariq
          <br />
          Sigmaringer Str. 27
          <br />
          10713 Berlin
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail allgemein: hello@zynapse.eu
          <br />
          Netzwerk für Kreative: network@zynapse.eu
          <br />
          Operative Themen: ops@zynapse.eu
        </p>
      </LegalSection>

      <LegalSection title="Rechtsform und steuerliche Hinweise">
        <p>
          Codariq wird als Einzelunternehmen von Tarik Arthur Marshall geführt.
          Es besteht kein Eintrag im Handelsregister.
        </p>
        <p>
          Eine Umsatzsteuer-Identifikationsnummer wurde nicht angegeben. Sofern
          Leistungen der Kleinunternehmerregelung unterliegen, erfolgt ein
          gesonderter Hinweis in den jeweiligen Angeboten oder Rechnungen.
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für journalistisch-redaktionelle Inhalte">
        <p>
          Tarik Arthur Marshall
          <br />
          Sigmaringer Str. 27
          <br />
          10713 Berlin
        </p>
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung">
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </LegalSection>
    </section>
  );
}
