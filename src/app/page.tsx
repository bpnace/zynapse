import { JsonLdScript } from "@/components/seo/json-ld";
import { CampaignPackPreview } from "@/components/marketing/campaign-pack-preview";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { ProblemCards } from "@/components/marketing/problem-cards";
import { ProcessStepper } from "@/components/marketing/process-stepper";
import { SplitBenefits } from "@/components/marketing/split-benefits";
import { TrustSection } from "@/components/marketing/trust-section";
import { VideoOutputGrid } from "@/components/marketing/video-output-grid";
import { HomeMotion } from "@/components/animation/home-motion";
import { buildMetadata, buildPageJsonLd, buildServiceJsonLd, buildVideoObjectJsonLd } from "@/lib/seo";
import { videoVariants } from "@/lib/mock-data/studio";

const homePageSeo = {
  title: "Kuratiertes AI-Kampagnensystem für Brands | Zynapse",
  description:
    "Zynapse verbindet Brands mit kuratierten AI-Spezialist:innen und übersetzt Briefings in lean koordinierte Kampagnen-Setups, markenfähige Varianten und klare Handover.",
  path: "/",
} as const;

export const metadata = buildMetadata(homePageSeo);

export default function HomePage() {
  const baseJsonLd = buildPageJsonLd({
    ...homePageSeo,
    primaryEntity: buildServiceJsonLd({
      path: homePageSeo.path,
      name: "Kuratiertes AI-Kampagnensystem für Brands",
      description: homePageSeo.description,
      serviceType: "Kuratiertes AI-Kampagnensystem",
      audience: "Brands, Marketing- und Performance-Teams",
    }),
  });

  const videoNodes = videoVariants.map((v) =>
    buildVideoObjectJsonLd({
      id: v.id,
      name: v.hookTitle,
      description: `${v.angle} – ${v.objective} (${v.deliveryLabel})`,
      contentUrl: v.src,
      uploadDate: "2025-01-01",
      length: v.length,
      pageUrl: "/",
    }),
  );

  const homeJsonLd = {
    ...baseJsonLd,
    "@graph": [...baseJsonLd["@graph"], ...videoNodes],
  };

  return (
    <>
      <JsonLdScript data={homeJsonLd} />
      <HomeMotion>
        <Hero />
        <ProblemCards />
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
