export type PricingPlanId = "starter" | "growth" | "pro";

export type NavItem = {
  href: string;
  label: string;
  kind?: "link" | "cta";
};

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  price: string;
  cadence: string;
  description: string;
  audience: string;
  featured?: boolean;
  highlights: string[];
  fit: string;
  collaboration: string;
  contactMessage: string;
  deliverables: string[];
};

export type CaseStudyEntry = {
  slug: string;
  brand: string;
  sector: string;
  summary: string;
  challenge: string;
  outcome: string;
  metrics: string[];
};

export type CampaignAngle = {
  title: string;
  angle: string;
  hooks: string[];
  lengths: string[];
};

export type VideoVariantPreview = {
  id: string;
  angle: string;
  hookTitle: string;
  format: string;
  length: string;
  objective: "Awareness" | "Conversion" | "Retention";
};
