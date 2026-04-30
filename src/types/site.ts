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

export type CampaignAngle = {
  title: string;
  angle: string;
  hooks: string[];
  lengths: string[];
};

export type VideoVariantPreview = {
  id: string;
  src: string;
  angle: string;
  hookTitle: string;
  scenarioCopy: string;
  format: string;
  length: string;
  objective: string;
  deliveryLabel: string;
};
