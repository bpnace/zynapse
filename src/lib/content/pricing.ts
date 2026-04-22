import type { PricingPlan } from "@/types/site";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Pilot",
    price: "ab 2.499€",
    cadence: "einmalig",
    description:
      "Für Teams, die eine erste Kampagne testen und schnell zu einem sauberen Kreativplan kommen wollen.",
    audience:
      "Für Brands mit einem klaren Produkt, einem ersten Kampagnenziel und dem Bedarf, schnell ins Testfenster zu kommen.",
    highlights: ["Zynapse Core enthalten", "schneller Start", "erstes Creative Pack"],
    fit: "Ideal, wenn ihr ein neues Produkt, ein neues Messaging oder eine erste Kampagnenidee testen wollt, ohne direkt einen laufenden Produktionsmodus aufzubauen.",
    collaboration:
      "Briefing-Analyse, Kreativrouten, Auswahl passender AI Creatives, Qualitätscheck, zentraler Review und Delivery Pack.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für euren Pilot Flow. Wir möchten eine erste Kampagne testen und verstehen, welchen Kreativplan, welches Timing und welche Review-Struktur ihr dafür empfehlt.\n\nViele Grüße",
    deliverables: [
      "Zynapse Core enthalten",
      "Kreativplan für 1 Pilot-Kampagne",
      "12 Video-Varianten in 2 Formaten",
      "1 zentrale Review-Runde",
      "Delivery Pack für Paid Social",
    ],
  },
  {
    id: "growth",
    name: "Growth Flow",
    price: "ab 5.999€",
    cadence: "pro Monat",
    description:
      "Der laufende Modus für Teams, die jeden Monat neue Creatives brauchen und dabei nicht jedes Mal neu koordinieren wollen.",
    audience:
      "Für Brands mit laufendem Kampagnenbedarf und dem Wunsch nach einem verlässlichen Creative-Rhythmus.",
    featured: true,
    highlights: ["Zynapse Core enthalten", "laufender Rhythmus", "sichtbare Learnings"],
    fit: "Ideal, wenn aus einzelnen Tests ein monatlicher Creative Flow werden soll und ihr dafür einen verlässlichen Prozess statt neuer Ad-hoc-Besetzungen braucht.",
    collaboration:
      "Briefing-Analyse, Kreativrouten, Auswahl passender AI Creatives, Qualitätscheck, zentraler Review und Delivery Pack in laufender Kadenz.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für euren Growth Flow. Wir suchen einen laufenden Modus für wiederkehrende Kampagnen und möchten verstehen, wie ihr Kreativplan, Iteration und Delivery über mehrere Sprints organisiert.\n\nViele Grüße",
    deliverables: [
      "Zynapse Core enthalten",
      "Laufender Kreativplan für mehrere Messaging-Routen",
      "24 bis 36 Video-Varianten",
      "Priorisierte Review- und Iterations-Slots",
      "Monatliche Learnings für den nächsten Sprint",
    ],
  },
  {
    id: "pro",
    name: "Scale",
    price: "Individuell",
    cadence: "skalierender Flow",
    description:
      "Für Teams mit mehreren Kampagnen, Märkten oder Stakeholdern, die einen skalierenden Creative Flow brauchen.",
    audience:
      "Für größere Marketing-Setups mit mehreren Workstreams, Märkten oder Freigabepfaden.",
    highlights: ["Zynapse Core enthalten", "mehrere Workstreams", "skalierbare Freigaben"],
    fit: "Ideal, wenn mehrere Kampagnen, Märkte oder interne Stakeholder parallel laufen und Zynapse den Creative Flow dauerhaft koordinieren soll.",
    collaboration:
      "Briefing-Analyse, Kreativrouten, Auswahl passender AI Creatives, Qualitätscheck, zentraler Review und Delivery Pack für komplexe Setups.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für euren Scale Flow. Wir planen mehrere Kampagnen oder Märkte parallel und möchten besprechen, wie ihr Struktur, Freigaben und Delivery dafür aufsetzt.\n\nViele Grüße",
    deliverables: [
      "Zynapse Core enthalten",
      "Mehrere Kampagnen-Workstreams",
      "Skalierbare Review- und Freigabelogik",
      "Zentrale Priorisierung über mehrere Kampagnen",
      "Flexible Export- und Rechte-Logik",
    ],
  },
];
