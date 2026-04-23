import { getEnv } from "@/lib/env";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Datenschutz | Zynapse",
  description:
    "Datenschutzhinweise für Zynapse, Codariq, Consent-Management, Formulare, Hosting und Analytics.",
  path: "/legal/privacy",
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

export default function PrivacyPage() {
  const { analyticsId } = getEnv();

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pt-15 pb-16 sm:px-8">
      <h1 className="font-display text-5xl leading-[0.92] font-semibold tracking-[-0.06em] text-[var(--copy-strong)]">
        Datenschutzhinweise für Zynapse
      </h1>
      <p className="max-w-3xl text-base leading-7 text-[color:var(--copy-body)] sm:text-[1.0625rem]">
        Nachfolgend informieren wir dich über Art, Umfang und Zwecke der
        Verarbeitung personenbezogener Daten im Zusammenhang mit dem
        Webauftritt von Zynapse, den Kontaktmöglichkeiten auf der Website sowie
        den Formularen für Kreativbriefings und Bewerbungen als AI Creative.
      </p>

      <LegalSection title="1. Verantwortlicher">
        <p>
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
        </p>
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
        <p>
          E-Mail: hello@zynapse.eu
          <br />
          Weitere Kontaktadressen: network@zynapse.eu und ops@zynapse.eu
        </p>
        <p>
          Zynapse ist ein Angebot von Codariq. Ein Datenschutzbeauftragter ist
          derzeit nicht benannt.
        </p>
      </LegalSection>

      <LegalSection title="2. Hosting und allgemeiner Websitebetrieb">
        <p>
          Diese Website wird über Infrastruktur von Strato gehostet. Dabei
          werden zur technischen Bereitstellung und Absicherung der Website
          übliche Server-Logdaten verarbeitet. Dazu können insbesondere
          folgende Daten gehören:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>abgerufene Inhalte und Dateipfade</li>
          <li>Referrer-URL</li>
          <li>Browsertyp und Browserversion</li>
          <li>verwendetes Betriebssystem</li>
          <li>Statuscodes und übertragene Datenmengen</li>
        </ul>
        <p>
          Die Verarbeitung erfolgt, um die Website technisch bereitzustellen,
          die Stabilität und Sicherheit zu gewährleisten und Missbrauch oder
          Störungen nachvollziehen zu können.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
          Interesse liegt im sicheren und funktionsfähigen Betrieb der Website.
        </p>
      </LegalSection>

      <LegalSection title="3. Kontaktaufnahme per E-Mail oder Kontaktformular">
        <p>
          Wenn du uns per E-Mail oder über das Kontaktformular kontaktierst,
          verarbeiten wir die von dir mitgeteilten Daten zur Bearbeitung deines
          Anliegens.
        </p>
        <p>Im Kontaktformular verarbeiten wir insbesondere:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Name</li>
          <li>E-Mail-Adresse</li>
          <li>Team- oder Firmenname</li>
          <li>Topic, Teamkontext und Nachrichteninhalt</li>
          <li>technische Anti-Spam-Angaben wie Zeitstempel und Honeypot-Feld</li>
        </ul>
        <p>
          Die Verarbeitung erfolgt zur Bearbeitung deiner Anfrage, zur
          Kommunikation mit dir sowie zur Anbahnung oder Durchführung einer
          möglichen Zusammenarbeit.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit sich deine
          Anfrage auf vorvertragliche Maßnahmen oder eine konkrete
          Zusammenarbeit bezieht, und im Übrigen Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="4. Kreativbriefing">
        <p>
          Wenn du ein Kreativbriefing übermittelst, verarbeiten wir die von dir
          eingegebenen Daten, um die Anfrage einzuordnen, intern zu prüfen und
          einen passenden nächsten Schritt oder Creative Flow abzuleiten.
        </p>
        <p>Hierzu gehören insbesondere:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Branche</li>
          <li>Produktlink</li>
          <li>Ziel, Zielgruppe, Kaufbarriere, Kanäle, Budgetrahmen und Zeitplan</li>
          <li>optionale Zusatzinformationen wie Stilrichtung, Review-Hinweise oder Referenzen</li>
          <li>Kontaktname, geschäftliche E-Mail und Firma</li>
          <li>technische Anti-Spam-Angaben wie Zeitstempel und Honeypot-Feld</li>
        </ul>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche
          Maßnahmen sowie Art. 6 Abs. 1 lit. f DSGVO für die strukturierte
          Prüfung und Bearbeitung von Anfragen.
        </p>
      </LegalSection>

      <LegalSection title="5. Bewerbung als AI Creative">
        <p>
          Wenn du dich als Kreative:r oder Spezialist:in bewirbst, verarbeiten
          wir deine Angaben zur Prüfung der Passung für zukünftige
          Kampagnenarbeit und für die Anbahnung einer möglichen Zusammenarbeit.
        </p>
        <p>Hierzu gehören insbesondere:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Name und E-Mail-Adresse</li>
          <li>Portfolio- oder LinkedIn-Link</li>
          <li>Standort oder Zeitzone</li>
          <li>Fokusbereiche</li>
          <li>Case-Erfahrung, Verfügbarkeit und Vergütungshinweise</li>
          <li>technische Anti-Spam-Angaben wie Zeitstempel und Honeypot-Feld</li>
        </ul>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Bewerbung
          auf die Anbahnung einer Zusammenarbeit gerichtet ist, sowie Art. 6
          Abs. 1 lit. f DSGVO für die Auswahl und Bearbeitung geeigneter
          Kontaktaufnahmen.
        </p>
      </LegalSection>

      <LegalSection title="6. Lokale Zwischenspeicherung im Browser">
        <p>
          Für das Kreativbriefing und die Bewerbung als AI Creative werden
          Formulareingaben im Browser zwischengespeichert, damit begonnene
          Eingaben nach einem Reload oder Seitenwechsel nicht verloren gehen.
        </p>
        <p>
          Die Speicherung erfolgt über den lokalen Speicher deines Browsers
          (`localStorage`) und bleibt grundsätzlich auf deinem Endgerät.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
          Interesse liegt in einer nutzerfreundlichen, stabilen Formnutzung.
        </p>
        <p>
          Du kannst diese Daten jederzeit selbst über die Funktionen deines
          Browsers löschen. Nach dem erfolgreichen Absenden werden die lokal
          gespeicherten Formulardaten in den entsprechenden Flows ebenfalls
          entfernt.
        </p>
      </LegalSection>

      <LegalSection title="7. Weiterleitung und Empfänger von Formulardaten">
        <p>
          Formulardaten werden serverseitig entgegengenommen und für die
          weitere Bearbeitung aufbereitet. Im Produktivbetrieb sollen Anfragen
          per Webhook an eine selbst betriebene n8n-Instanz weitergeleitet
          werden, die auf Infrastruktur von Strato in Deutschland betrieben
          wird.
        </p>
        <p>
          Von dort können Formulardaten in Google Sheets weiterverarbeitet
          werden, um Leads und Anfragen strukturiert zu verwalten.
        </p>
        <p>
          Soweit ein externer Webhook noch nicht aktiv konfiguriert ist, erfolgt
          zunächst nur die serverseitige Entgegennahme innerhalb der
          Website-Infrastruktur.
        </p>
        <p>
          Rechtsgrundlage ist für die Bearbeitung der Anfrage oder Bewerbung
          Art. 6 Abs. 1 lit. b DSGVO und im Übrigen Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="8. Consent-Management, Cookies und Widerruf">
        <p>
          Wir verwenden auf dieser Website das Consent-Management-Tool CCM19,
          um Einwilligungen für einwilligungspflichtige Technologien
          einzuholen, zu verwalten und zu dokumentieren.
        </p>
        <p>
          Anbieter ist Papoo Software &amp; Media GmbH, Auguststr. 4, 53229
          Bonn, Deutschland.
        </p>
        <p>
          Dabei können insbesondere der Zeitpunkt des Seitenaufrufs, eine
          zufällige Kennung, der Einwilligungsstatus sowie technische
          Informationen zur Auslieferung des Consent-Banners verarbeitet
          werden.
        </p>
        <p>
          Die Verarbeitung erfolgt, um gesetzlich erforderliche Einwilligungen
          nachweisbar einzuholen und Widerrufe zu verwalten.
        </p>
        <p>
          Nicht technisch erforderliche Cookies und vergleichbare Technologien
          werden erst nach einer entsprechenden Auswahl im Consent-Dialog
          gesetzt oder ausgelesen. Über die Cookie-Einstellungen im Footer oder
          das eingeblendete CCM19-Widget kannst du deine Auswahl jederzeit
          erneut öffnen und ändern.
        </p>
        <p>
          In der jeweiligen Detailansicht des Consent-Tools stellen wir die
          wesentlichen Informationen zu den eingesetzten Diensten bereit,
          insbesondere zu Anbieter, Zweck, eingesetzten Cookies oder ähnlichen
          Technologien, Speicherdauer sowie einem möglichen Drittlandbezug.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit den
          jeweils anwendbaren Anforderungen an das Setzen und Auslesen nicht
          technisch erforderlicher Technologien auf Endgeräten.
        </p>
      </LegalSection>

      <LegalSection title="9. Google Analytics 4">
        <p>
          Soweit Google Analytics 4 technisch aktiviert ist, setzen wir den
          Dienst zur Reichweitenmessung und Analyse der Nutzung der Website ein.
          {analyticsId ? (
            <>
              {" "}
              Die aktuell konfigurierte Mess-ID lautet
              <span className="font-medium text-[var(--copy-strong)]">
                {" "}
                {analyticsId}
              </span>
              .
            </>
          ) : (
            <> In der aktuellen Konfiguration ist Google Analytics 4 derzeit nicht aktiv.</>
          )}
        </p>
        <p>
          Dabei können insbesondere Informationen über Seitenaufrufe,
          Interaktionen, technische Gerätemerkmale, ungefähre
          Standortinformationen, Referrer, Sitzungsdaten und eine gekürzte
          IP-Adresse verarbeitet werden.
        </p>
        <p>
          Google Analytics wird erst nach deiner Einwilligung über das
          vorgeschaltete Consent-Management mit CCM19 geladen. Ohne eine
          entsprechende Auswahl im Consent-Tool bleibt der Google-Tag blockiert.
        </p>
        <p>
          Rechtsgrundlage für den Einsatz von Google Analytics ist Art. 6 Abs.
          1 lit. a DSGVO sowie § 25 TDDDG, soweit für den Zugriff auf
          Informationen auf deinem Endgerät oder deren Speicherung eine
          Einwilligung erforderlich ist.
        </p>
        <p>
          Anbieter von Google Analytics 4 ist Google Ireland Limited, Gordon
          House, Barrow Street, Dublin 4, Irland. Es kann nicht ausgeschlossen
          werden, dass Daten auch durch verbundene Unternehmen von Google,
          insbesondere Google LLC in den USA, verarbeitet werden. Google
          verwendet nach eigenen Angaben geeignete Transfermechanismen,
          insbesondere Standardvertragsklauseln, soweit erforderlich.
        </p>
        <p>
          Deine Einwilligung kannst du jederzeit mit Wirkung für die Zukunft
          über die Cookie-Einstellungen im Footer, das eingeblendete
          Consent-Widget oder die Einstellungen des Consent-Banners widerrufen
          oder anpassen.
        </p>
      </LegalSection>

      <LegalSection title="10. Schriftarten">
        <p>
          Für die Wortmarke wird die Schriftart Outfit über `next/font/google`
          eingebunden. Nach dem aktuellen technischen Stand werden die benötigten
          Schriftdateien in die Website-Auslieferung integriert. Beim bloßen
          Laden der Seite findet dadurch nicht ohne Weiteres ein separater Abruf
          der Schrift durch deinen Browser direkt bei Google statt.
        </p>
      </LegalSection>

      <LegalSection title="11. Speicherdauer">
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie dies für die
          jeweiligen Zwecke erforderlich ist.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Server- und Sicherheitsdaten speichern wir nur für den Zeitraum,
            der für den sicheren Betrieb und die Fehleranalyse technisch
            erforderlich ist.
          </li>
          <li>
            Kontakt- und Formulardaten speichern wir für die Dauer der
            Bearbeitung sowie darüber hinaus, soweit dies für die
            Kommunikation, Leadverwaltung, Nachverfolgung oder gesetzliche
            Aufbewahrungspflichten notwendig ist.
          </li>
          <li>
            Lokal gespeicherte Formulardaten verbleiben auf deinem Endgerät,
            bis du sie selbst löschst, sie überschrieben werden oder der
            jeweilige Flow sie nach erfolgreichem Absenden entfernt.
          </li>
          <li>
            Analytics-Daten werden, sofern Google Analytics aktiviert ist, nach
            den im jeweiligen Analytics-Konto konfigurierten Fristen
            gespeichert.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="12. Empfänger und Drittlandbezug">
        <p>Empfänger personenbezogener Daten können insbesondere sein:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Strato als Hosting-Dienstleister</li>
          <li>Papoo Software &amp; Media GmbH als Anbieter von CCM19</li>
          <li>die selbst betriebene n8n-Instanz zur Formularweiterleitung</li>
          <li>Google Sheets zur Lead- und Anfrageverwaltung</li>
          {analyticsId ? <li>Google Analytics 4, sofern eingewilligt wurde</li> : null}
        </ul>
        <p>
          Bei der Nutzung von Google-Diensten kann eine Übermittlung in
          Drittstaaten, insbesondere in die USA, nicht ausgeschlossen werden.
          In solchen Fällen stützt sich die Verarbeitung nach Angaben des
          Anbieters auf geeignete Garantien wie Standardvertragsklauseln.
        </p>
      </LegalSection>

      <LegalSection title="13. Deine Rechte">
        <p>Du hast im Rahmen der gesetzlichen Voraussetzungen das Recht auf:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Auskunft über deine bei uns gespeicherten Daten</li>
          <li>Berichtigung unrichtiger Daten</li>
          <li>Löschung deiner Daten</li>
          <li>Einschränkung der Verarbeitung</li>
          <li>Datenübertragbarkeit</li>
          <li>Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO</li>
          <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft</li>
        </ul>
        <p>
          Zur Ausübung deiner Rechte genügt eine Nachricht an hello@zynapse.eu.
        </p>
      </LegalSection>

      <LegalSection title="14. Beschwerderecht bei einer Aufsichtsbehörde">
        <p>
          Du hast außerdem das Recht, dich bei einer Datenschutzaufsichtsbehörde
          zu beschweren. Zuständig für uns ist insbesondere:
        </p>
        <p>
          Berliner Beauftragte für Datenschutz und Informationsfreiheit
          <br />
          Alt-Moabit 59-61
          <br />
          10555 Berlin
          <br />
          E-Mail: mailbox@datenschutz-berlin.de
          <br />
          Website: https://www.datenschutz-berlin.de/
        </p>
      </LegalSection>

      <LegalSection title="15. Keine automatisierte Entscheidungsfindung">
        <p>
          Eine automatisierte Entscheidungsfindung oder ein Profiling im Sinne
          von Art. 22 DSGVO findet im Zusammenhang mit dieser Website und den
          beschriebenen Formularen derzeit nicht statt.
        </p>
      </LegalSection>

      <LegalSection title="16. Aktualisierung dieser Hinweise">
        <p>
          Wir passen diese Datenschutzhinweise an, wenn sich die Website, die
          eingesetzten Dienste oder die rechtlichen Anforderungen ändern.
          Maßgeblich ist die jeweils auf dieser Seite veröffentlichte
          Fassung.
        </p>
      </LegalSection>
    </section>
  );
}
