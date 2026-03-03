import type { PricingPlan } from "@/types/site";

export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Kampagne",
    price: "2.400",
    cadence: "pro Launch",
    description:
      "Für Teams, die ein erstes Kampagnen-Setup schnell, sauber und ohne lange Vorlaufzeit live bringen wollen.",
    audience: "Für Marken- und Growth-Teams mit klarem Offer und erstem Testfenster.",
    highlights: ["Pilot-Setup", "1 Offer", "schneller Go-live"],
    fit: "Ideal, wenn ein neues Produkt, ein frisches Messaging oder ein klar umrissener Launch schnell getestet werden soll.",
    collaboration:
      "Kompaktes Briefing, fokussierte Kampagnenplanung und eine klare Review-Schleife bis zum Export.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für die Starter Kampagne. Wir möchten ein erstes Kampagnen-Setup für ein klar umrissenes Offer aufsetzen und würden gerne verstehen, wie Kickoff, Timing und Freigabe bei diesem Paket aussehen.\n\nViele Grüße",
    deliverables: [
      "1 Kampagnen-Pack mit 3 Angles",
      "12 Video-Varianten in 2 Formaten",
      "1 Review-Runde mit Team-Freigabe",
      "Exportfertige Assets für Paid Social",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: "5.900",
    cadence: "pro Monat",
    description:
      "Der laufende Produktionsmodus für Teams, die Creative systematisch testen und regelmäßig neue Varianten brauchen.",
    audience: "Für Marken mit wiederkehrendem Paid-Social-Bedarf oder laufender Creative-Rotation.",
    featured: true,
    highlights: ["laufender Modus", "Testing-Rhythmus", "Priorisierte Iteration"],
    fit: "Ideal, wenn Creative nicht nur produziert, sondern jeden Monat strategisch getestet, bewertet und nachgebaut werden soll.",
    collaboration:
      "Laufende Kampagnenplanung mit wiederkehrenden Iterationen, engerer Abstimmung und sichtbarer Testing-Roadmap.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für das Growth Paket. Wir suchen einen laufenden Modus für regelmäßige Creative-Tests und möchten einschätzen, wie eure monatliche Planung, Iteration und Zusammenarbeit im Detail aussieht.\n\nViele Grüße",
    deliverables: [
      "Monatlicher Kampagnen-Stack für mehrere Messaging-Routen",
      "24 bis 36 Video-Varianten",
      "Manager-geführte Testing-Roadmap",
      "Priorisierte Iterations-Slots",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "Individuell",
    cadence: "Multi-Marke / Team",
    description:
      "Für Teams und Agenturstrukturen mit mehreren Marken, Stakeholdern und parallelen Freigabewegen.",
    audience: "Für größere Setups mit mehreren Workstreams und abgestimmter Planungslogik.",
    highlights: ["Multi-Brand", "mehrere Stakeholder", "skalierbare Freigaben"],
    fit: "Ideal, wenn mehrere Marken, interne Teams oder Agenturstrukturen parallel koordiniert und sauber priorisiert werden müssen.",
    collaboration:
      "Gemeinsame Planungsrituale, teambasierte Review-Spuren und flexible Rechte- und Exportlogik für komplexere Setups.",
    contactMessage:
      "Hallo Zynapse,\n\nwir interessieren uns für das Pro Paket. Wir planen ein Setup mit mehreren Marken, Stakeholdern oder parallelen Workstreams und möchten besprechen, wie ihr Planung, Freigaben und Delivery dafür aufsetzt.\n\nViele Grüße",
    deliverables: [
      "Mehrere Marken-Workstreams",
      "Gemeinsame Kampagnen- und Review-Rituale",
      "Teambasierte Freigabe-Spur",
      "Flexible Export- und Rechte-Logik",
    ],
  },
];
