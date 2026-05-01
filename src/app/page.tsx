import { JsonLdScript } from "@/components/seo/json-ld";
import { CampaignPackPreview } from "@/components/marketing/campaign-pack-preview";
import { FinalCta } from "@/components/marketing/final-cta";
import { FooterReminder } from "@/components/marketing/footer-reminder";
import { Hero } from "@/components/marketing/hero";
import { HomepagePricingTeaser } from "@/components/marketing/homepage-pricing-teaser";
import { MarketingFaq } from "@/components/marketing/marketing-faq";
import { ProblemCards } from "@/components/marketing/problem-cards";
import { ProcessStepper } from "@/components/marketing/process-stepper";
import { VideoOutputGrid } from "@/components/marketing/video-output-grid";
import { HomeMotion } from "@/components/animation/home-motion";
import {
  buildMarketingFaqJsonLd,
  buildMarketingMetadata,
  buildMarketingPageJsonLd,
  getMarketingRouteFaqItems,
} from "@/lib/seo";

export const metadata = buildMarketingMetadata("/");

export default function HomePage() {
  const homeJsonLd = buildMarketingPageJsonLd("/");
  const homeFaqJsonLd = buildMarketingFaqJsonLd("/");
  const homeFaqItems = getMarketingRouteFaqItems("/");

  return (
    <>
      <JsonLdScript data={homeJsonLd} />
      {homeFaqJsonLd ? <JsonLdScript data={homeFaqJsonLd} /> : null}
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
          <section
            className="order-7 mx-auto w-full max-w-7xl px-6 pt-2 pb-16 sm:px-8 lg:px-10"
            data-reveal-section
            data-stagger="dense"
          >
            <MarketingFaq
              items={homeFaqItems}
              title="FAQ zum Creative Sprint."
              copy="Kurz beantwortet, was vor einem testbaren Creative Pack geklärt wird und warum Zynapse Core nicht nur einzelne Videos, sondern eine saubere Kampagnenlogik vorbereitet."
            />
          </section>
          <div className="order-8">
            <FinalCta />
          </div>
          <div className="order-9">
            <FooterReminder />
          </div>
        </div>
      </HomeMotion>
    </>
  );
}
