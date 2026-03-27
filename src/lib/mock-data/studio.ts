import type { CampaignAngle, VideoVariantPreview } from "@/types/site";

export const campaignAngles: CampaignAngle[] = [
  {
    title: "Einstieg",
    angle: "Schnell ins erste Review",
    hooks: [
      "72 Stunden vom Briefing zum ersten Setup",
      "Weniger Koordination bis zur ersten sichtbaren Variante",
      "Aus einer Anfrage werden direkt belastbare Review-Routen",
    ],
    lengths: ["12s", "20s", "30s"],
  },
  {
    title: "Setup",
    angle: "Passende Rollen für die Anfrage",
    hooks: [
      "Zynapse kuratiert das Setup statt offener Freelancer-Suche",
      "Die richtigen Spezialist:innen pro Kampagne statt Vollzeit-Hiring",
      "Klare Verantwortlichkeiten statt offener Schleifen",
    ],
    lengths: ["15s", "25s", "35s"],
  },
  {
    title: "Varianten",
    angle: "Mehr Richtungen aus einem abgestimmten Setup",
    hooks: [
      "Mehr kreative Wege aus einem abgestimmten Setup",
      "Varianten ohne neue Sourcing-Schleife",
      "Mehr Auswahl für Review, Paid Social und nächste Ausspielungen",
    ],
    lengths: ["9s", "18s", "27s"],
  },
];

export const videoVariants: VideoVariantPreview[] = [
  {
    id: "v1",
    src: "/videos/11.mp4",
    angle: "Natur & Architektur",
    hookTitle: "Eine Bildwelt bauen, die Marke sofort größer wirken lässt",
    format: "21:9",
    length: "6s",
    objective: "Worldbuilding",
    deliveryLabel: "Hero-Loop",
  },
  {
    id: "v2",
    src: "/videos/22.mp4",
    angle: "Luxus & Spannung",
    hookTitle: "Luxus nicht erklären, sondern über Bewegung und Kontrast aufladen",
    format: "1:1",
    length: "12s",
    objective: "Prestige",
    deliveryLabel: "Luxury-Spot",
  },
  {
    id: "v3",
    src: "/videos/33.mp4",
    angle: "Editorial & Bewegung",
    hookTitle: "Fashion-Momente mit Bewegung statt statischem Editorial zeigen",
    format: "9:16",
    length: "15s",
    objective: "Editorial",
    deliveryLabel: "Style-Cut",
  },
  {
    id: "v4",
    src: "/videos/44.mp4",
    angle: "Retail & Surrealität",
    hookTitle: "Retail-Umgebungen mit einem visuellen Twist sofort aufbrechen",
    format: "4:5",
    length: "10s",
    objective: "Retail",
    deliveryLabel: "Scene-Twist",
  },
  {
    id: "v5",
    src: "/videos/55.mp4",
    angle: "Industrie & Reveal",
    hookTitle: "Technik und Spannung in einem klaren Reveal zusammenführen",
    format: "16:9",
    length: "8s",
    objective: "Reveal",
    deliveryLabel: "Industrial-Cut",
  },
  {
    id: "v6",
    src: "/videos/66.mp4",
    angle: "Food & Detail",
    hookTitle: "Food so nah und präzise zeigen, dass Wertigkeit direkt spürbar wird",
    format: "3:4",
    length: "18s",
    objective: "Food-Detail",
    deliveryLabel: "Macro-Loop",
  },
];

export const studioTimeline = [
  {
    title: "Eingabe",
    detail: "Ziel, Produkt, Guardrails, Budget, Kanal",
  },
  {
    title: "Setup",
    detail: "Rollen, Hooks, CTA-Routen, Freigaben, Produktionsplan",
  },
  {
    title: "Handover",
    detail: "Varianten, Versionen und Kontext für Review, Ads und nächste Iterationen",
  },
];
