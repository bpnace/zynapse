import type { CampaignAngle, VideoVariantPreview } from "@/types/site";

export const campaignAngles: CampaignAngle[] = [
  {
    title: "Briefing-Qualität",
    angle: "Mehr Klarheit vor der ersten Variante",
    hooks: [
      "82 Prozent vollständig, für bessere Szenarien fehlt noch die wichtigste Kaufbarriere",
      "Produkt, Ziel und Kanal reichen für den ersten Kreativplan",
      "Fehlende Infos werden sichtbar, bevor Feedback teuer wird",
    ],
    lengths: ["82%", "1 Lücke", "bereit"],
  },
  {
    title: "Creative-Szenarien",
    angle: "Passende Richtungen statt Zufallsoutput",
    hooks: [
      "Problem Hook, Product Proof und Offer Push sauber getrennt testen",
      "Die richtige Mischung aus Hook, Format und CTA statt einer einzigen Idee",
      "Szenarien werden nach Zielgruppe und Kanal priorisiert",
    ],
    lengths: ["3 Szenarien", "4 Formate", "priorisiert"],
  },
  {
    title: "Media Pack",
    angle: "Geprüfter Output für Review und Ausspielung",
    hooks: [
      "12 Assets bereit, 4 Formate, 3 Hooks, 1 Download Pack",
      "3 Varianten sind reviewbereit, 2 brauchen noch Anpassung",
      "Nächste Aktion: Szenario 2 freigeben",
    ],
    lengths: ["12 Assets", "4 Formate", "1 Pack"],
  },
];

export const videoVariants: VideoVariantPreview[] = [
  {
    id: "v1",
    src: "/videos/11.mp4",
    angle: "Cinematic Brand World",
    hookTitle: "Bambus-Tempel als ruhiger Premium-Einstieg",
    scenarioCopy:
      "Der Clip setzt keine Produktdetails, sondern zuerst eine klare Markenwelt: Bambus, Licht und Architektur funktionieren als ruhiger Einstieg für Wellness, Travel oder Premium-Kampagnen. Im Sprint kann daraus ein Opening, ein Cutdown und eine ruhigere Awareness-Variante entstehen.",
    format: "16:9",
    length: "8s",
    objective: "Markenwelt",
    deliveryLabel: "Mood Szenario",
  },
  {
    id: "v2",
    src: "/videos/22.mp4",
    angle: "Premium Drama",
    hookTitle: "Dunkler Hero-Moment mit starkem Momentum",
    scenarioCopy:
      "Die Bullen, Kerzen und Reflexionen liefern einen kraftvollen Hook für Launches, Claims oder High-Impact-Intros, bei denen Stärke und Spannung im Vordergrund stehen. Das Material eignet sich für kurze First-Frame-Tests, Claim-Overlays und eine dramatischere Hero-Variante.",
    format: "16:9",
    length: "8s",
    objective: "Aufmerksamkeit",
    deliveryLabel: "Hero Hook",
  },
  {
    id: "v3",
    src: "/videos/33.mp4",
    angle: "Fashion Motion",
    hookTitle: "Street-Fashion-Visual mit Bewegung im ersten Frame",
    scenarioCopy:
      "Die laufende Figur und die Papierflügel erzählen sofort eine visuelle Idee. Das passt zu Fashion-, Culture- oder Awareness-Varianten mit organischem City-Look, besonders wenn Bewegung, Haltung und ein prägnanter Hook schon in den ersten Sekunden sitzen müssen.",
    format: "16:9",
    length: "8s",
    objective: "Aufmerksamkeit",
    deliveryLabel: "Style Cut",
  },
  {
    id: "v4",
    src: "/videos/44.mp4",
    angle: "Retail Proof",
    hookTitle: "Frische-Herkunft direkt am Regal zeigen",
    scenarioCopy:
      "Supermarkt, Mitarbeitende und Feld-Portal verbinden Verkaufsort und Ursprung. Der Clip eignet sich für Food-, Retail- oder Nachhaltigkeitsclaims, weil er Proof nicht abstrakt erklärt, sondern direkt zwischen Regal, Team und Herkunft sichtbar macht.",
    format: "16:9",
    length: "8s",
    objective: "Vertrauen",
    deliveryLabel: "Proof Szenario",
  },
  {
    id: "v5",
    src: "/videos/55.mp4",
    angle: "Product Energy",
    hookTitle: "Toolbox als Action-Hook für Produktnutzen",
    scenarioCopy:
      "Die explodierende Werkzeugkiste zeigt Nutzen, Kraft und Einsatzumfeld in Sekunden. Das passt zu Tools, Hardware oder B2B-Produkten, die mehr Dynamik brauchen und ihre Produktvorteile nicht nur als Liste, sondern als sofort lesbaren Action-Moment zeigen wollen.",
    format: "16:9",
    length: "8s",
    objective: "Produktnutzen",
    deliveryLabel: "Action Cut",
  },
  {
    id: "v6",
    src: "/videos/66.mp4",
    angle: "Product Close-up",
    hookTitle: "Close-up eines Premium-Food-Moments",
    scenarioCopy:
      "Das Dessert öffnet sich in einem ruhigen Macro-Loop. Textur, Handwerk und Wertigkeit tragen hier den Hook für Food-, Luxury- oder Product-Detail-Szenarien, bei denen Nahbarkeit, Qualität und Appetit wichtiger sind als laute Effekte.",
    format: "16:9",
    length: "8s",
    objective: "Produktdetail",
    deliveryLabel: "Macro Proof",
  },
];

export const studioTimeline = [
  {
    title: "Briefing",
    detail: "Produkt, Ziel, Zielgruppe, Kanäle, Markenregeln",
  },
  {
    title: "Kreativplan",
    detail: "Szenarien, Formate, Hooks, CTAs und passende Creative-Rollen",
  },
  {
    title: "Creative Pack",
    detail: "Geprüfte Varianten, Review-Status und Delivery Pack für die Ausspielung",
  },
];
