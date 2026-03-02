import type { NavItem } from "@/types/site";

export const siteNav: NavItem[] = [
  { href: "/brands", label: "Für Brands" },
  { href: "/managers", label: "Für Manager" },
  { href: "/studio", label: "Studio" },
  { href: "/pricing", label: "Preise" },
  { href: "/cases", label: "Referenzen" },
  { href: "/contact", label: "Kontakt" },
];

export const primaryCta: NavItem = {
  href: "/request",
  label: "Kampagne anfragen",
  kind: "cta",
};

export const heroMetrics = [
  { value: "72h", label: "typischer Kampagnen-Setup" },
  { value: "18+", label: "Video-Varianten pro Briefing" },
  { value: "6", label: "Export-Formate für Ads Manager" },
];

export const problemCards = [
  {
    title: "Zu viele Optionen, keine klare Entscheidung",
    description:
      "UGC, Ads, Creator, Strategie und AI-Tools verschwimmen schnell. Zynapse ordnet das in einen klaren Produktionspfad.",
  },
  {
    title: "Agenturen teuer, Output unplanbar",
    description:
      "Kein Overhead-Pitching, keine offenen Schleifen. Jede Anfrage startet mit einem festen Kampagnen-Setup und sichtbaren Deliverables.",
  },
  {
    title: "Content-Druck jede Woche, Creative Fatigue",
    description:
      "Statt Einzelvideos entsteht ein Testsystem aus Hooks, Angles, Varianten und Formaten, das laufend nachgebaut werden kann.",
  },
];

export const processSteps = [
  {
    title: "Marken-Anfrage",
    owner: "Marke",
    description:
      "Produkt, Ziel, Tonalität, Budget und Kanal werden in einen kompakten Intake übersetzt.",
  },
  {
    title: "Kampagnenplanung",
    owner: "Social Media Manager",
    description:
      "Angles, Hooks, CTA-Logik und Testing-Struktur werden ausformuliert und priorisiert.",
  },
  {
    title: "Briefing-Paket",
    owner: "System + Manager",
    description:
      "Ein Creator-Pack mit Formatregeln, Messaging und Freigabegrenzen wird gebaut.",
  },
  {
    title: "Videogenerierung",
    owner: "Studio",
    description:
      "Aus jedem Angle entstehen mehrere Cuts, Längen und Platzierungsvarianten ohne Creator-Chaos.",
  },
  {
    title: "Review und Export",
    owner: "Marke",
    description:
      "Freigaben, Iterationen und Exporte laufen zentral, bevor Assets live in Media Buying oder Social Publishing gehen.",
  },
];

export const brandBenefits = [
  "Planbare Produktion mit klaren Meilensteinen",
  "Performance-orientierte Creatives statt Einzelstücke",
  "Weniger Agentur-Overhead, mehr Transparenz",
  "Saubere Rollen zwischen Brand, Manager und System",
];

export const managerBenefits = [
  "Neue Kunden ohne Kaltakquise-Druck",
  "Kampagnenlogik als bezahlter Kernwert",
  "Skalierbarer Output ohne Creator-Operations",
  "Wiederkehrende Revenue pro Kunde oder Kampagne",
];

export const trustSignals = [
  {
    title: "Rechte & Nutzung",
    description:
      "Jede Produktion wird mit klarer Nutzungslogik, Asset-Grenzen und später erweiterbaren Vertragsbausteinen gedacht.",
  },
  {
    title: "Markensicherheit",
    description:
      "Freigaben bleiben beim Brand. Hooks, Claims und CTA-Räume werden vor Export sichtbar gemacht.",
  },
  {
    title: "Freigabeprozess",
    description:
      "Assets werden nicht blind ausgespielt. Das Studio liefert Versionen, die vor Veröffentlichung abgenommen werden.",
  },
  {
    title: "DSGVO-ready Setup",
    description:
      "Die v1-Architektur ist für EU-konforme Prozesse, Hosting-Transparenz und minimierte Datenerhebung vorbereitet.",
  },
];

export const studioPrinciples = [
  "Kampagnenlogik vor Video-Output",
  "Jede Anfrage produziert Varianten statt Einzelassets",
  "Manager steuern Performance-Richtung, Studio skaliert die Ausführung",
];

export const footerGroups = [
  {
    title: "Navigation",
    links: siteNav,
  },
  {
    title: "Ressourcen",
    links: [
      { href: "/request", label: "Marken-Anfrage" },
      { href: "/apply", label: "Manager Bewerbung" },
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
    value: "hello@zynapse.example",
    copy: "Briefings, Preisgestaltung, Launch-Planung",
  },
  {
    label: "Manager-Netzwerk",
    value: "network@zynapse.example",
    copy: "Bewerbungen, Qualifizierung, Partnerfragen",
  },
  {
    label: "Betrieb",
    value: "ops@zynapse.example",
    copy: "Datenschutz, Rechte, Produktionsabläufe",
  },
];
