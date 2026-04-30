import type { PricingPlan } from "@/types/site";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Pilot",
    price: "ab 2.499€",
    cadence: "einmalig",
    description:
      "Schnell starten und nach einem ersten, klaren Briefing liefern.",
    audience:
      "Ideal bei klarem ersten Kampagnenziel und begrenzter Launch-Phase.",
    highlights: ["Zynapse Core", "schneller Start", "erstes Creative Pack"],
    fit: "Ideal für den ersten Kampagnenstart, bevor ihr einen Dauerbetrieb braucht.",
    collaboration:
      "Briefing-Analyse, Szenario-Skizze, AI-Selection, Qualitätscheck, zentrale Übergabe.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für euren Pilot-Rahmen. Wir möchten eine erste Kampagne testen und verstehen, welchen Kreativplan, welches Timing und welche Review-Struktur ihr dafür empfehlt.\n\nViele Grüße",
    deliverables: [
      "Kreativplan für 1 Pilot-Kampagne",
      "12 Video-Varianten in 2 Formaten",
      "1 zentrale Review-Runde",
      "Delivery Pack für Paid Social",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "ab 5.999€",
    cadence: "pro Monat",
    description:
      "Kontinuierlich neue Creatives aufsetzen, ohne jeden Monat neu zu starten.",
    audience:
      "Für Teams mit monatlicher Kampagnenrate und wiederkehrenden Briefings.",
    featured: true,
    highlights: ["Zynapse Core", "laufender Rhythmus", "sichtbare Learnings"],
    fit: "Ideal, wenn aus Einzeltests ein planbarer Monatsbetrieb werden soll.",
    collaboration:
      "Monatliche Szenarien, AI-Selection, Review, Learnings, feste Übergaben.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für euren Growth-Rahmen. Wir suchen einen laufenden Modus für wiederkehrende Kampagnen und möchten verstehen, wie ihr Kreativplan, Iteration und Delivery über mehrere Sprints organisiert.\n\nViele Grüße",
    deliverables: [
      "Laufender Kreativplan für mehrere Messaging-Szenarien",
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
      "Komplexe Setups mit vielen Kampagnen, Märkten und Freigaben vereinheitlichen.",
    audience:
      "Für Setups mit mehreren Teams, Märkten oder parallelen Kampagnen.",
    highlights: ["Zynapse Core", "mehrere Workstreams", "skalierbare Freigaben"],
    fit: "Ideal, wenn ihr mehrere Kampagnenstränge zentral steuern wollt.",
    collaboration:
      "Zentrale Priorisierung, Freigabelogik und Delivery für komplexe Kampagnenblöcke.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für euren Scale-Rahmen. Wir planen mehrere Kampagnen oder Märkte parallel und möchten besprechen, wie ihr Struktur, Freigaben und Delivery dafür aufsetzt.\n\nViele Grüße",
    deliverables: [
      "Mehrere Kampagnen-Workstreams",
      "Skalierbare Review- und Freigabelogik",
      "Zentrale Priorisierung über mehrere Kampagnen",
      "Flexible Export- und Rechte-Logik",
    ],
  },
];
