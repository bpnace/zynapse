import type { NavItem } from "@/types/site";

export const siteNav: NavItem[] = [
  { href: "/brands", label: "Für Brands" },
  { href: "/cases", label: "Cases" },
  { href: "/pricing", label: "Preise" },
  { href: "/creatives", label: "Für Kreative" },
];

export const primaryCta: NavItem = {
  href: "/request",
  label: "Kampagne anfragen",
  kind: "cta",
};

export const loginCta: NavItem = {
  href: "/login",
  label: "Login",
  kind: "link",
};

export const heroMetrics = [
  { value: "72h", label: "bis zum ersten Kreativplan" },
  { value: "12-36", label: "Varianten je nach Paket" },
  { value: "1", label: "zentraler Review statt Feedback-Chaos" },
];

export const problemCards = [
  {
    title: "Creative Fatigue",
    description:
      "Eure Top-Assets ziehen nicht mehr, aber neue Varianten brauchen zu lange, weil Briefing, Material und Freigabe jedes Mal neu organisiert werden.",
  },
  {
    title: "Review-Drift",
    description:
      "Feedback liegt in Slack, Mail und Calls. Dadurch wird unklar, welche Entscheidung final ist, welche Änderung noch offen bleibt und wer den nächsten Schritt besitzt.",
  },
  {
    title: "Volumen ohne Lernen",
    description:
      "Mehr Varianten erzeugen nur dann bessere Daten, wenn klar ist, welche Hook, welches Format und welche Funnel-Aufgabe wirklich getestet wird.",
  },
];

export const processSteps = [
  {
    title: "Briefing",
    owner: "Brand Team",
    description:
      "Ihr beschreibt Produkt, Ziel, Zielgruppe und Brand-Regeln. Vorhandene Produktshots, Creator-Clips, Packshots oder Guidelines werden direkt als Materialbasis eingeordnet.",
  },
  {
    title: "Produktion und Review",
    owner: "ZYNAPSE",
    description:
      "Zynapse Core entwickelt daraus Szenarien, Hooks und Varianten. Die Review-Runde bleibt zentral, damit Feedback nicht zwischen Dateien, Calls und Nachrichten zerläuft.",
  },
  {
    title: "Creative Pack",
    owner: "Media Team",
    description:
      "Das fertige Creative Pack kommt sortiert nach Naming, Format und Funnel-Aufgabe. Euer Media-Team sieht, was getestet werden soll und wie die Varianten zusammenhängen.",
  },
];

export const brandBenefits = [
  "Mehr Varianten für Paid Social, Reels und Short Form, ohne jedes Mal neue Einzelproduktionen oder lose Abstimmungen anstoßen zu müssen",
  "Creative-Szenarien statt einzelner Ad-Ideen, damit Hooks, Formate und Funnel-Aufgaben zusammen gedacht werden",
  "Zentraler Review mit klaren Freigaben, damit Feedback nicht zwischen Slack, Mail und Calls zerläuft",
  "Fertiges Creative Pack für euer Media Team, inklusive Kontext für Naming, Nutzung und nächste Tests",
];

export const creativeBenefits = [
  "Klare Aufgaben statt chaotischer Briefings, damit du vor dem Start weißt, welchen Beitrag deine Rolle leisten soll",
  "Markenregeln, No-Gos und Ziel sichtbar im Flow, nicht nur als lose Hinweise in einem alten Briefing",
  "Feedback als konkrete nächste Aufgabe statt verstreuter Kommentare, damit Iterationen schneller und sauberer werden",
  "Echte Kampagnen mit sauberem Beitrag zum finalen Output, nicht nur Einzelprompts ohne Anschluss an Review und Delivery",
];

export const trustSignals = [
  {
    title: "Markenregeln bleiben sichtbar",
    description:
      "Claims, No-Gos und Stilvorgaben laufen durch den gesamten Prozess mit und verschwinden nicht zwischen zwei Freigaberunden.",
  },
  {
    title: "Reviews laufen an einem Ort",
    description:
      "Kommentare, Entscheidungen und Freigaben bleiben nachvollziehbar, damit euer Team jederzeit weiß, was final ist.",
  },
  {
    title: "Rechte und Nutzung werden dokumentiert",
    description:
      "Finale Assets kommen mit klaren Hinweisen zur Nutzung, damit Übergabe und Weiterarbeit nicht in Rückfragen hängen bleiben.",
  },
  {
    title: "Direkte Wettbewerber bleiben getrennt",
    description:
      "Wir arbeiten in einem laufenden Zynapse-Core-Prozess nicht parallel für zwei direkte Wettbewerber derselben engen Kategorie.",
  },
];

export const studioPrinciples = [
  "Brands geben Ziel, Marke und Kanal vor, Zynapse Core baut daraus einen Kreativplan mit Szenarien, Formaten und Review-Schritten",
  "Jede Anfrage führt zu testbaren Creative Packs statt zu losen Einzelassets, damit Output und Lernziel zusammenbleiben",
  "Review, Freigaben und Delivery bleiben in einem klaren Flow zusammen, vom ersten Kommentar bis zur Media-Übergabe",
];

export const footerGroups = [
  {
    title: "Navigation",
    links: [...siteNav, { href: "/about", label: "Über uns" }],
  },
  {
    title: "Ressourcen",
    links: [
      { href: "/request", label: "Kampagne anfragen" },
      { href: "/apply", label: "Als Creative bewerben" },
      { href: "/contact", label: "Kontakt" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/legal/imprint", label: "Impressum" },
      { href: "/legal/privacy", label: "Datenschutz" },
    ],
  },
];

export const contactChannels = [
  {
    label: "Allgemein",
    value: "hello@zynapse.eu",
    copy: "Wenn du eine Kampagne anfragen oder herausfinden willst, welcher Zynapse-Core-Rahmen zu eurem Team passt.",
  },
  {
    label: "Netzwerk für Kreative",
    value: "network@zynapse.eu",
    copy: "Wenn du dich als AI Creative, Spezialist:in oder Produktionspartner:in bei uns melden möchtest.",
  },
  {
    label: "Betrieb",
    value: "ops@zynapse.eu",
    copy: "Wenn du Fragen zu Rechten, Datenschutz, Review oder operativen Abläufen hast.",
  },
];
