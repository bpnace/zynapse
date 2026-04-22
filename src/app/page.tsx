import { JsonLdScript } from "@/components/seo/json-ld";
import { CampaignPackPreview } from "@/components/marketing/campaign-pack-preview";
import { CoreSection } from "@/components/marketing/core-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { ProblemCards } from "@/components/marketing/problem-cards";
import { ProcessStepper } from "@/components/marketing/process-stepper";
import { SplitBenefits } from "@/components/marketing/split-benefits";
import { TrustSection } from "@/components/marketing/trust-section";
import { VideoOutputGrid } from "@/components/marketing/video-output-grid";
import { HomeMotion } from "@/components/animation/home-motion";
import { buildMetadata, buildPageJsonLd, buildServiceJsonLd } from "@/lib/seo";

const homePageSeo = {
  title: "Bessere Video Creatives für Marketing-Teams | Zynapse",
  description:
    "Zynapse hilft Marketing-Teams, schneller bessere Video Creatives zu bekommen. Zynapse Core plant Kreativrouten, wählt passende AI Creatives aus und liefert geprüfte Creative Packs für Paid Social und Short Form.",
  path: "/",
} as const;

export const metadata = buildMetadata(homePageSeo);

export default function HomePage() {
  const homeJsonLd = buildPageJsonLd({
    ...homePageSeo,
    primaryEntity: buildServiceJsonLd({
      path: homePageSeo.path,
      name: "Kuratiertes AI-Kampagnensystem für Brands",
      description: homePageSeo.description,
      serviceType: "Kuratiertes AI-Kampagnensystem",
      audience: "Brands, Marketing- und Performance-Teams",
    }),
  });

  return (
    <>
      <JsonLdScript data={homeJsonLd} />
      <HomeMotion>
        <Hero />
        <ProblemCards />
        <CoreSection />
        <ProcessStepper />
        <CampaignPackPreview />
        <VideoOutputGrid />
        <SplitBenefits />
        <TrustSection />
        <FinalCta />
      </HomeMotion>
    </>
  );
}
