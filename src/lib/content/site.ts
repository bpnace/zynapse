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
  { value: "72h", label: "bis zum ersten kuratierten Setup" },
  { value: "6", label: "Kernrollen im Netzwerk" },
  { value: "18+", label: "Varianten pro Kampagnen-Setup" },
];

export const problemCards = [
  {
    title: "Das Briefing ist da, das passende Setup fehlt",
    description:
      "Die Brand kennt Ziel, Produkt und Kanal. Was oft fehlt, ist die richtige Kombination aus Strategie, Prompting, Produktion und Review.",
  },
  {
    title: "Zu viele Schleifen zwischen Brand, Spezialist:innen und Freigaben",
    description:
      "Wenn Rollen, Feedback und Zuständigkeiten nicht geklärt sind, verliert jede Kampagne Tempo, noch bevor die erste Variante sichtbar wird.",
  },
  {
    title: "Jede Runde startet organisatorisch wieder bei null",
    description:
      "Statt auf einem funktionierenden Setup aufzubauen, werden People, Prozesse und Deliverables für jede neue Anfrage neu sortiert.",
  },
];

export const processSteps = [
  {
    title: "Brand-Anfrage",
    owner: "Brand / Team",
    description:
      "Die Brand gibt Ziel, Produkt, Kanal, Budget und Guardrails vor. Daraus entsteht ein Briefing, mit dem das Setup sauber arbeiten kann.",
  },
  {
    title: "Kuratiertes Matching",
    owner: "Zynapse",
    description:
      "Zynapse stellt die passenden Spezialist:innen für Strategie, Prompting, Produktion und Review zusammen.",
  },
  {
    title: "Kampagnen-Setup",
    owner: "Setup",
    description:
      "Hooks, Botschaften, Formatlogik, Freigabepunkte und Produktionsplan werden in einen belastbaren Ablauf übersetzt.",
  },
  {
    title: "Produktion & Review",
    owner: "Netzwerk",
    description:
      "Das kuratierte Setup produziert Varianten, stimmt Modellmix und Ausführung ab und führt die Brand durch einen klaren Review-Prozess.",
  },
  {
    title: "Handover",
    owner: "Brand / Media",
    description:
      "Am Ende stehen kampagnenfähige Assets, Versionen und Kontext für Paid Social, Content oder die nächste Iteration.",
  },
];

export const brandBenefits = [
  "Passendes Spezialist:innen-Setup statt eigener Rollenpuzzles",
  "Ein Kampagnenfluss von Briefing bis Handover",
  "Mehr Varianten ohne klassischen Agentur-Overhead",
  "Klare Reviews, Freigaben und Verantwortlichkeiten",
];

export const creativeBenefits = [
  "Teil eines kuratierten Netzwerks statt Kaltakquise",
  "Anfragen, in denen deine Spezialisierung Teil eines klaren Setups wird",
  "Klare Briefings, Reviews und planbare Übergaben pro Anfrage",
  "Brand-Anfragen mit echtem Kampagnenbedarf statt losem Creator-Sourcing",
];

export const trustSignals = [
  {
    title: "Rechte & Nutzung",
    description:
      "Jedes Setup ist so gedacht, dass Nutzungslogik, Asset-Grenzen und spätere Vertragserweiterungen sauber anschlussfähig bleiben.",
  },
  {
    title: "Brand Safety",
    description:
      "Hooks, Claims, Bilderwelten und Freigaben bleiben prüfbar. Vor dem Export ist sichtbar, was freigegeben wurde und was nicht.",
  },
  {
    title: "Review & Freigaben",
    description:
      "Keine Variante geht blind live. Zynapse hält Review-Schritte, Zuständigkeiten und Entscheidungen nachvollziehbar zusammen.",
  },
  {
    title: "Datenschutz & Prozesse",
    description:
      "Die v1 ist auf geringe Datenerhebung, klare Verantwortlichkeiten und nachvollziehbare Übergaben ausgelegt.",
  },
];

export const studioPrinciples = [
  "Brands bringen Ziel und Briefing, Zynapse kuratiert das passende Setup",
  "Jede Anfrage führt zu einem Kampagnen-Setup statt zu losen Einzelassets",
  "Spezialist:innen und Brand arbeiten in einem gemeinsamen Review- und Handover-Fluss",
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
    value: "hello@zynapse.eu",
    copy: "Wenn du über eine Brand-Anfrage, Pakete oder den richtigen Einstieg sprechen willst.",
  },
  {
    label: "Netzwerk für Kreative",
    value: "network@zynapse.eu",
    copy: "Wenn du dich als Kreative:r, Spezialist:in oder Partner:in bei uns melden möchtest.",
  },
  {
    label: "Betrieb",
    value: "ops@zynapse.eu",
    copy: "Wenn du Fragen zu Rechten, Datenschutz oder Abläufen hast.",
  },
];
