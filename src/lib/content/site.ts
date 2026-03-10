import type { NavItem } from "@/types/site";

export const siteNav: NavItem[] = [
  { href: "/brands", label: "Für Brands" },
  { href: "/creatives", label: "Für Kreative" },
  { href: "/about", label: "Studio" },
  { href: "/pricing", label: "Preise" },
  { href: "/contact", label: "Kontakt" },
];

export const primaryCta: NavItem = {
  href: "/request",
  label: "Brand-Anfrage",
  kind: "cta",
};

export const heroMetrics = [
  { value: "72h", label: "bis zum ersten Upload" },
  { value: "18+", label: "testbare Varianten pro Briefing" },
  { value: "6", label: "Formate für Ads und Social" },
];

export const problemCards = [
  {
    title: "Zu viele Ideen, aber keine klare Priorität",
    description:
      "Zwischen UGC, Trends, Hooks und AI-Tools fehlt oft die Reihenfolge. Zynapse übersetzt Kreativ-Druck in eine Kampagnenlogik, die testbar bleibt.",
  },
  {
    title: "Zu viele Schleifen zwischen Team, Freigabe und Produktion",
    description:
      "Wenn Briefing, Feedback und Ausspielung nicht sauber getrennt sind, wird jede Iteration teuer. Zynapse macht den nächsten Schritt und die erwarteten Deliverables sichtbar.",
  },
  {
    title: "Zu viel Druck auf einzelne Hero-Kreative",
    description:
      "Statt auf ein einzelnes Video zu hoffen, entstehen systematisch Varianten für unterschiedliche Hooks, Angles, Formate und Platzierungen.",
  },
];

export const processSteps = [
  {
    title: "Brand-Anfrage",
    owner: "Brand / Team",
    description:
      "Das Team gibt Produkt, Ziel, Stil, Budget und Freigaben vor. Daraus entsteht ein Briefing, mit dem alle Beteiligten sauber arbeiten können.",
  },
  {
    title: "Kampagnenplanung",
    owner: "Creative Lead",
    description:
      "Angles, Hooks, CTA-Logik und Testprioritäten werden so aufgebaut, dass sie im Performance-Alltag wirklich tragen.",
  },
  {
    title: "Briefing-Paket",
    owner: "Creative Lead + System",
    description:
      "Aus der Kampagnenlogik entsteht ein Briefing-Paket mit Messaging, Formatregeln und klaren Freigabegrenzen.",
  },
  {
    title: "Videogenerierung",
    owner: "Studio",
    description:
      "Aus jedem Angle entstehen mehrere Cuts, Längen und Platzierungsvarianten, ohne dass das Team neue Produktionsschleifen öffnen muss.",
  },
  {
    title: "Review und Export",
    owner: "Team",
    description:
      "Das Team prüft Freigaben zentral. Erst danach gehen Varianten in Media Buying, Publishing oder die nächste Iteration.",
  },
];

export const brandBenefits = [
  "Planbare Produktion mit klaren Meilensteinen",
  "Mehr testbare Kreativvarianten pro Briefing",
  "Weniger Abstimmungsschleifen zwischen Team, Kreativen und Studio",
  "Freigaben und Feedback bleiben bis zum Export nachvollziehbar",
];

export const creativeBenefits = [
  "Du verkaufst Kreativstrategie statt Produktionschaos",
  "Klare Briefings statt endloser Abstimmungsschleifen",
  "Skalierbarer Output über mehrere AI-Rollen hinweg",
  "Planbare Erlöse pro Kunde, Sprint oder Kampagne",
];

export const trustSignals = [
  {
    title: "Rechte & Nutzung",
    description:
      "Jede Produktion ist so gedacht, dass Nutzungslogik, Asset-Grenzen und spätere Vertragserweiterungen sauber anschlussfähig bleiben.",
  },
  {
    title: "Markensicherheit",
    description:
      "Freigaben bleiben im Team. Hooks, Claims und CTA-Räume werden vor Export sichtbar und nachvollziehbar geprüft.",
  },
  {
    title: "Freigabeprozess",
    description:
      "Keine Variante geht blind live. Das Studio liefert eine klare Review-Spur, bevor Assets in Ads oder Social ausgesteuert werden.",
  },
  {
    title: "DSGVO-ready Setup",
    description:
      "Die v1 ist auf geringe Datenerhebung, nachvollziehbare Prozesse und eine EU-kompatible Weiterentwicklung ausgelegt.",
  },
];

export const studioPrinciples = [
  "Kampagnenlogik vor Video-Output",
  "Jede Anfrage produziert Varianten statt Einzelassets",
  "Kreative steuern Performance-Richtung, Studio skaliert die Ausführung",
];

export const footerGroups = [
  {
    title: "Navigation",
    links: siteNav,
  },
  {
    title: "Ressourcen",
    links: [
      { href: "/request", label: "Brand-Anfrage" },
      { href: "/apply", label: "Bewerbung für Kreative" },
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
    value: "hello@zynapse.de",
    copy: "Brand-Anfragen, Paketberatung und Erstgespräche",
  },
  {
    label: "Netzwerk für Kreative",
    value: "network@zynapse.de",
    copy: "Bewerbungen, Qualifizierung, Partneranfragen",
  },
  {
    label: "Betrieb",
    value: "ops@zynapse.de",
    copy: "Rechte, Datenschutz, Prozessfragen",
  },
];
