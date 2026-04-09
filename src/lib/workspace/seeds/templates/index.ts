import { d2cProductLaunchTemplate } from "@/lib/workspace/seeds/templates/d2c-product-launch";
import { performanceRefreshTemplate } from "@/lib/workspace/seeds/templates/performance-refresh";
import { reviewSprintTemplate } from "@/lib/workspace/seeds/templates/review-sprint";
import {
  seedTemplateKeys,
  type SeedTemplate,
  type SeedTemplateKey,
} from "@/lib/workspace/seeds/types";

const templates: Record<SeedTemplateKey, SeedTemplate> = {
  d2c_product_launch: d2cProductLaunchTemplate,
  performance_refresh: performanceRefreshTemplate,
  review_sprint: reviewSprintTemplate,
};

export function getSeedTemplate(templateKey: string | null | undefined): SeedTemplate {
  if (templateKey && seedTemplateKeys.includes(templateKey as SeedTemplateKey)) {
    return templates[templateKey as SeedTemplateKey];
  }

  return templates.d2c_product_launch;
}

export function listSeedTemplates() {
  return seedTemplateKeys.map((key) => templates[key]);
}
