import { JsonLdScript } from "@/components/seo/json-ld";
import { CampaignPackPreview } from "@/components/marketing/campaign-pack-preview";
import { FinalCta } from "@/components/marketing/final-cta";
import { FooterReminder } from "@/components/marketing/footer-reminder";
import { Hero } from "@/components/marketing/hero";
import { HomepagePricingTeaser } from "@/components/marketing/homepage-pricing-teaser";
import { ProblemCards } from "@/components/marketing/problem-cards";
import { ProcessStepper } from "@/components/marketing/process-stepper";
import { VideoOutputGrid } from "@/components/marketing/video-output-grid";
import { HomeMotion } from "@/components/animation/home-motion";
import { buildMetadata, buildPageJsonLd, buildServiceJsonLd } from "@/lib/seo";

const homePageSeo = {
  title: "Mehr testbare Video Ads für Brands | Zynapse",
  description:
    "Zynapse übersetzt Briefings in kreative Szenarien, Hooks und Varianten für Paid Social. Brands bekommen testbare Video Ads ohne mehr Koordination.",
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
        <div className="flex flex-col">
          <div className="order-1">
            <Hero />
          </div>
          <div className="order-2">
            <ProblemCards />
          </div>
          <div className="order-3">
            <ProcessStepper />
          </div>
          <div className="order-4">
            <CampaignPackPreview />
          </div>
          <div className="order-5 lg:order-6">
            <HomepagePricingTeaser />
          </div>
          <div className="order-6 lg:order-5">
            <VideoOutputGrid />
          </div>
          <div className="order-7">
            <FinalCta />
          </div>
          <div className="order-8">
            <FooterReminder />
          </div>
        </div>
      </HomeMotion>
    </>
  );
}
