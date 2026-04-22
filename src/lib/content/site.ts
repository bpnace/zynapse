import type { NavItem } from "@/types/site";

export const siteNav: NavItem[] = [
  { href: "/brands", label: "Für Marketing Teams" },
  { href: "/#beispiele", label: "Beispiele" },
  { href: "/pricing", label: "Preise" },
  { href: "/creatives", label: "Für Kreative" },
  { href: "/contact", label: "Kontakt" },
];

export const primaryCta: NavItem = {
  href: "/request",
  label: "Kampagne anfragen",
  kind: "cta",
};

export const heroMetrics = [
  { value: "72h", label: "bis zum ersten Kreativplan" },
  { value: "12-36", label: "Varianten je nach Paket" },
  { value: "1", label: "zentraler Review statt Feedback-Chaos" },
];

export const problemCards = [
  {
    title: "Zu wenig neue Varianten",
    description:
      "Euer Media Team braucht frische Creatives für Tests, aber jede neue Runde kostet wieder Zeit, Abstimmung und Energie.",
  },
  {
    title: "Zu viel Feedback-Chaos",
    description:
      "Kommentare liegen in Slack, E-Mails, Calls und Ordnern. Am Ende ist unklar, welche Version wirklich freigegeben ist.",
  },
  {
    title: "Zu wenig System im Creative Testing",
    description:
      "Hooks, Formate und Botschaften werden oft einzeln gedacht. Dadurch entstehen Assets, aber keine klare Lernkurve für die nächste Runde.",
  },
];

export const processSteps = [
  {
    title: "Briefing starten",
    owner: "Marketing Team",
    description:
      "Ihr gebt Produkt, Ziel, Kanäle, Timing und Markenregeln vor. Mehr braucht Zynapse Core nicht für den ersten sauberen Start.",
  },
  {
    title: "Kreativplan erhalten",
    owner: "Zynapse Core",
    description:
      "Aus Ziel, Zielgruppe und Angebot entstehen klare Kreativrouten, Formate und Testschwerpunkte statt lose Einzelideen.",
  },
  {
    title: "AI Creatives arbeiten geführt daran",
    owner: "Creative Team",
    description:
      "Die passenden Rollen bekommen klare Aufgaben, Qualitätskriterien und einen gemeinsamen Fokus auf Hooks, Botschaften und Formate.",
  },
  {
    title: "Varianten werden geprüft",
    owner: "Zynapse Core",
    description:
      "Bevor euer Team reviewt, prüft Zynapse Core Markenfit, Format, Verständlichkeit, Wiederholung und mögliche Risiken.",
  },
  {
    title: "Creative Pack geht live",
    owner: "Media Team",
    description:
      "Euer Team reviewt zentral und bekommt fertige Assets, Versionen und Empfehlungen direkt nutzbar für Paid Social und Short Form.",
  },
];

export const brandBenefits = [
  "Mehr Varianten für Paid Social, Reels und Short Form",
  "Kreativrouten statt einzelner Ad-Ideen",
  "Zentraler Review mit klaren Freigaben",
  "Fertiges Creative Pack für euer Media Team",
];

export const creativeBenefits = [
  "Klare Aufgaben statt chaotischer Briefings",
  "Markenregeln, No-Gos und Ziel klar sichtbar",
  "Feedback als konkrete nächste Aufgabe statt verstreuter Kommentare",
  "Echte Kampagnen mit sauberem Beitrag zum finalen Output",
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
    title: "Datenschutz bleibt schlank",
    description:
      "Zynapse fragt nur die Informationen ab, die für Briefing, Produktion, Review und die nächsten sauberen Schritte wirklich nötig sind.",
  },
];

export const studioPrinciples = [
  "Marketing Teams geben Ziel, Marke und Kanal vor, Zynapse Core baut daraus den Kreativplan",
  "Jede Anfrage führt zu testbaren Creative Packs statt zu losen Einzelassets",
  "Review, Freigaben und Delivery bleiben in einem klaren Flow zusammen",
];

export const footerGroups = [
  {
    title: "Navigation",
    links: siteNav,
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
    label: "Vertrieb",
    value: "hello@zynapse.eu",
    copy: "Wenn du eine Kampagne anfragen oder herausfinden willst, welcher Creative Flow zu eurem Team passt.",
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
