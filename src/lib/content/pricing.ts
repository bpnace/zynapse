import type { PricingPlan } from "@/types/site";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter Kampagne",
    price: "2.400",
    cadence: "pro Launch",
    description:
      "Für erste Testläufe mit einer klaren Value Proposition und einem kompakten Channel-Fokus.",
    audience: "Für Teams, die zügig einen ersten Creative-Test aufsetzen wollen.",
    deliverables: [
      "1 Kampagnen-Pack mit 3 Angles",
      "12 Video-Varianten in 2 Formaten",
      "1 Review-Runde mit Brand-Freigabe",
      "Exportfertige Asset-Lieferung",
    ],
  },
  {
    name: "Growth",
    price: "5.900",
    cadence: "pro Monat",
    description:
      "Der laufende Produktionsmodus für Teams mit regelmäßigen Kampagnen und wachsendem Testing-Need.",
    audience: "Für Brands mit wiederkehrendem Paid-Social oder Creator-Output.",
    featured: true,
    deliverables: [
      "Monatlicher Kampagnen-Stack für mehrere Messaging-Routen",
      "24 bis 36 Video-Varianten",
      "Manager-geführte Testing-Roadmap",
      "Priorisierte Iterations-Slots",
    ],
  },
  {
    name: "Pro",
    price: "Individuell",
    cadence: "Multi-Marke / Team",
    description:
      "Für Inhouse-Teams oder Agenturgruppen mit mehreren Marken, Stakeholdern und parallelen Ausspielungen.",
    audience: "Für größere Teams mit Freigabeprozessen und mehreren Marken-Streams.",
    deliverables: [
      "Mehrere Marken-Workstreams",
      "Gemeinsame Planungsrituale",
      "Team-basierte Review-Spur",
      "Flexible Export- und Rechte-Logik",
    ],
  },
];
