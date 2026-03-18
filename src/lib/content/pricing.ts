import type { PricingPlan } from "@/types/site";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "ab 2.499€",
    cadence: "einmalig",
    description:
      "Für Brands, die ein erstes AI-Kampagnen-Setup mit klarem Scope und leanem Start aufsetzen wollen.",
    audience:
      "Für Brands mit einem klaren Offer und dem Bedarf, schnell ins erste Testfenster zu kommen.",
    highlights: ["Pilot-Setup", "kuratiertes Setup", "schneller Start"],
    fit: "Ideal, wenn ihr ein neues Produkt, ein neues Messaging oder eine erste Kampagnenidee sauber testen wollt, ohne direkt einen laufenden Produktionsmodus aufzubauen.",
    collaboration:
      "Kompaktes Briefing, passende Setup-Empfehlung und ein klarer Review-Pfad bis zum ersten kampagnenfähigen Output.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für euer Starter Paket. Wir möchten ein erstes AI-Kampagnen-Setup für ein klar umrissenes Offer aufsetzen und verstehen, welches Setup, Timing und welche Freigabelogik ihr dafür empfehlt.\n\nViele Grüße",
    deliverables: [
      "Kuratiertes Setup für 1 Pilot-Kampagne",
      "12 Video-Varianten in 2 Formaten",
      "1 zentrale Review-Runde",
      "Exportfertige Assets für Paid Social",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "ab 5.999€",
    cadence: "pro Monat",
    description:
      "Der laufende Modus für Brands, die AI-Kampagnen systematisch weiterführen und nicht jedes Mal neu aufsetzen wollen.",
    audience:
      "Für Brands mit laufendem Kampagnenbedarf und dem Wunsch nach einem verlässlichen Kreativ-Rhythmus.",
    featured: true,
    highlights: ["laufender Rhythmus", "priorisierte Iteration", "sichtbare Learnings"],
    fit: "Ideal, wenn aus einzelnen Tests ein monatlicher Kampagnenfluss werden soll und ihr dafür ein verlässliches Setup statt neuer Ad-hoc-Besetzungen braucht.",
    collaboration:
      "Wiederkehrende Planung, kuratierte Setup-Anpassung je Sprint und klare Übergaben zwischen Review, Iteration und Export.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für das Growth Paket. Wir suchen einen laufenden Modus für wiederkehrende AI-Kampagnen und möchten verstehen, wie ihr Planung, Iteration und das passende Setup über mehrere Sprints organisiert.\n\nViele Grüße",
    deliverables: [
      "Laufendes Kampagnen-Setup für mehrere Messaging-Routen",
      "24 bis 36 Video-Varianten",
      "Priorisierte Review- und Iterations-Slots",
      "Monatliche Learnings für den nächsten Sprint",
    ],
  },
  {
    id: "pro",
    name: "Enterprise",
    price: "Individuell",
    cadence: "skalierendes Setup",
    description:
      "Für größere Brand-Setups, die mehrere Kampagnenstränge dauerhaft in einem System koordinieren müssen.",
    audience:
      "Für größere Brand-Setups mit mehreren Workstreams, Märkten oder Freigabepfaden.",
    highlights: ["mehrere Workstreams", "skalierbare Freigaben", "zentral koordiniert"],
    fit: "Ideal, wenn mehrere Brands, Märkte oder interne Stakeholder parallel laufen und Zynapse das Setup dauerhaft koordinieren soll.",
    collaboration:
      "Gemeinsame Planungsrituale, skalierbare Freigaben und ein zentrales System für Priorisierung, Review und Export.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für euer Enterprise Paket. Wir planen ein komplexeres Setup mit mehreren Brands, Märkten oder parallelen Workstreams und möchten besprechen, wie ihr Struktur, Freigaben und die laufende Orchestrierung dafür aufsetzt.\n\nViele Grüße",
    deliverables: [
      "Mehrere Kampagnen-Workstreams",
      "Skalierbare Review- und Freigabelogik",
      "Zentrale Priorisierung über mehrere Setups",
      "Flexible Export- und Rechte-Logik",
    ],
  },
];
