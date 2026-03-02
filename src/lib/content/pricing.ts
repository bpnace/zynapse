import type { PricingPlan } from "@/types/site";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter Kampagne",
    price: "2.400",
    cadence: "pro Launch",
    description:
      "Für Teams, die ein erstes Kampagnen-Setup schnell, sauber und ohne lange Vorlaufzeit live bringen wollen.",
    audience: "Für Marken- und Growth-Teams mit klarem Offer und erstem Testfenster.",
    deliverables: [
      "1 Kampagnen-Pack mit 3 Angles",
      "12 Video-Varianten in 2 Formaten",
      "1 Review-Runde mit Team-Freigabe",
      "Exportfertige Assets für Paid Social",
    ],
  },
  {
    name: "Growth",
    price: "5.900",
    cadence: "pro Monat",
    description:
      "Der laufende Produktionsmodus für Teams, die Creative systematisch testen und regelmäßig neue Varianten brauchen.",
    audience: "Für Marken mit wiederkehrendem Paid-Social-Bedarf oder laufender Creative-Rotation.",
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
      "Für Teams und Agenturstrukturen mit mehreren Marken, Stakeholdern und parallelen Freigabewegen.",
    audience: "Für größere Setups mit mehreren Workstreams und abgestimmter Planungslogik.",
    deliverables: [
      "Mehrere Marken-Workstreams",
      "Gemeinsame Kampagnen- und Review-Rituale",
      "Teambasierte Freigabe-Spur",
      "Flexible Export- und Rechte-Logik",
    ],
  },
];
