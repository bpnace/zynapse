import { CampaignPackPreview } from "@/components/marketing/campaign-pack-preview";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { ProblemCards } from "@/components/marketing/problem-cards";
import { ProcessStepper } from "@/components/marketing/process-stepper";
import { SplitBenefits } from "@/components/marketing/split-benefits";
import { TrustSection } from "@/components/marketing/trust-section";
import { VideoOutputGrid } from "@/components/marketing/video-output-grid";
import { HomeMotion } from "@/components/animation/home-motion";

export default function HomePage() {
  return (
    <HomeMotion>
      <Hero />
      <ProblemCards />
      <ProcessStepper />
      <CampaignPackPreview />
      <VideoOutputGrid />
      <SplitBenefits />
      <TrustSection />
      <PricingTeaser />
      <FinalCta />
    </HomeMotion>
  );
}
