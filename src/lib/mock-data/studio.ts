import type { CampaignAngle, VideoVariantPreview } from "@/types/site";

export const campaignAngles: CampaignAngle[] = [
  {
    title: "Briefing-Qualität",
    angle: "Mehr Klarheit vor der ersten Variante",
    hooks: [
      "82 Prozent vollständig — für bessere Routen fehlt noch die wichtigste Kaufbarriere",
      "Produkt, Ziel und Kanal reichen für den ersten Kreativplan",
      "Fehlende Infos werden sichtbar, bevor Feedback teuer wird",
    ],
    lengths: ["82%", "1 Lücke", "bereit"],
  },
  {
    title: "Kreativrouten",
    angle: "Passende Richtungen statt Zufallsoutput",
    hooks: [
      "Problem Hook, Product Proof und Offer Push sauber getrennt testen",
      "Die richtige Mischung aus Hook, Format und CTA statt einer einzigen Idee",
      "Routen werden nach Zielgruppe und Kanal priorisiert",
    ],
    lengths: ["3 Routen", "4 Formate", "priorisiert"],
  },
  {
    title: "Media Pack",
    angle: "Geprüfter Output für Review und Ausspielung",
    hooks: [
      "12 Assets bereit, 4 Formate, 3 Hooks, 1 Download Pack",
      "3 Varianten sind reviewbereit, 2 brauchen noch Anpassung",
      "Nächste Aktion: Route 2 freigeben",
    ],
    lengths: ["12 Assets", "4 Formate", "1 Pack"],
  },
];

export const videoVariants: VideoVariantPreview[] = [
  {
    id: "v1",
    src: "/videos/11.mp4",
    angle: "Premium Look",
    hookTitle: "So lief unser Pilot mit einem Premium-Skincare-Brand",
    scenarioCopy:
      "Vorhandene Texturen, Packshots und Claims werden in Zynapse Core zu klaren Product-Proof- und Premium-Look-Routen erweitert.",
    format: "21:9",
    length: "6s",
    objective: "Vertrauen",
    deliveryLabel: "Brand Lift",
  },
  {
    id: "v2",
    src: "/videos/22.mp4",
    angle: "Offer Push",
    hookTitle: "Launch-Angebot ohne neue Produktion schärfen",
    scenarioCopy:
      "Zynapse Core trennt Offer Hook, Deadline und CTA, damit das Team mehrere Conversion-Routen statt nur eines Rabatts testen kann.",
    format: "1:1",
    length: "12s",
    objective: "Conversion",
    deliveryLabel: "Offer Cut",
  },
  {
    id: "v3",
    src: "/videos/33.mp4",
    angle: "UGC Style",
    hookTitle: "Creator-Material in native Short-Form-Varianten übersetzen",
    scenarioCopy:
      "Bestehende Clips bleiben die Basis. Zynapse Core erweitert Hook, Schnittlogik und Format, ohne den organischen Look zu verlieren.",
    format: "9:16",
    length: "15s",
    objective: "Aufmerksamkeit",
    deliveryLabel: "UGC Cut",
  },
  {
    id: "v4",
    src: "/videos/44.mp4",
    angle: "Founder oder Expert Style",
    hookTitle: "Founder-Erklärung in vertrauensbildende Ads führen",
    scenarioCopy:
      "Aus einem erklärenden Ausgangsmaterial entstehen Routen für Problemverständnis, Proof und Einwandbehandlung.",
    format: "4:5",
    length: "10s",
    objective: "Vertrauen",
    deliveryLabel: "Expert Cut",
  },
  {
    id: "v5",
    src: "/videos/55.mp4",
    angle: "Product Close-up",
    hookTitle: "Produktdetails sichtbarer machen, ohne die Marke zu verwässern",
    scenarioCopy:
      "Zynapse Core hält No-Gos, Claims und Look zusammen, während neue Close-up-Routen für Qualität und Nutzen entstehen.",
    format: "16:9",
    length: "8s",
    objective: "Produktverständnis",
    deliveryLabel: "Proof Cut",
  },
  {
    id: "v6",
    src: "/videos/66.mp4",
    angle: "Cinematic Visuals",
    hookTitle: "Aus Hero-Material mehrere kanalgerechte Einstiege bauen",
    scenarioCopy:
      "Ein starkes Key Visual wird nicht nur ausgespielt, sondern in unterschiedliche erste Sekunden, Formate und Review-Routen aufgeteilt.",
    format: "3:4",
    length: "18s",
    objective: "Aufmerksamkeit",
    deliveryLabel: "Hero Moment",
  },
];

export const studioTimeline = [
  {
    title: "Briefing",
    detail: "Produkt, Ziel, Zielgruppe, Kanäle, Markenregeln",
  },
  {
    title: "Kreativplan",
    detail: "Routen, Formate, Hooks, CTAs und passende Creative-Rollen",
  },
  {
    title: "Creative Pack",
    detail: "Geprüfte Varianten, Review-Status und Delivery Pack für die Ausspielung",
  },
];
