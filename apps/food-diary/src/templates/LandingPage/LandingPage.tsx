import { SkipLink } from "@repo/ui";
import { useTranslations } from "next-intl";
import type { LandingPageProps } from "./index";

import { CallToAction } from "@/components/CallToAction";
import { PageFooter } from "@/components/PageFooter";
import { PageHeader } from "@/components/PageHeader";
import { PageHero } from "@/components/PageHero";
import { ProductFeatures } from "@/components/ProductFeatures";
import { USPSection } from "@/components/USPSection";

export function LandingPage({ id = "landing-page", ...props }: LandingPageProps): React.JSX.Element {
  const t = useTranslations("landing");

  return (
    <div data-component-type="LandingPage" id={id} {...props}>
      <SkipLink>{t("common.skipToContent")}</SkipLink>
      <PageHeader />

      <main data-component-type="LandingMain" id="main-content">
        <PageHero backgroundImage="/img/hero_bg.jpg" />

        <CallToAction
          id="cta-primary"
          variant="default"
          title={t("cta.primary.title")}
          description={t("cta.primary.description")}
          buttonLabel={t("cta.primary.button")}
          buttonHref="/auth/login"
        />

        <USPSection
          items={[
            {
              id: "usp-simple",
              iconSrc: "/img/003-like.svg",
              title: t("usp.simple.title"),
              description: t("usp.simple.description"),
            },
            {
              id: "usp-accessible",
              iconSrc: "/img/002-tablet.svg",
              title: t("usp.accessible.title"),
              description: t("usp.accessible.description"),
            },
            {
              id: "usp-safe",
              iconSrc: "/img/001-shield.svg",
              title: t("usp.safe.title"),
              description: t("usp.safe.description"),
            },
          ]}
        />

        <CallToAction
          id="cta-feedback"
          variant="strong"
          title={t("cta.feedback.title")}
          description={t("cta.feedback.description")}
          buttonLabel={t("cta.feedback.button")}
          buttonHref="/feedback"
        />

        <ProductFeatures
          heading={t("features.heading")}
          items={[
            {
              id: "feature-moments",
              title: t("features.items.moments.title"),
              description: t("features.items.moments.description"),
            },
            {
              id: "feature-without-triggers",
              title: t("features.items.withoutTriggers.title"),
              description: t("features.items.withoutTriggers.description"),
            },
            {
              id: "feature-feelings",
              title: t("features.items.feelings.title"),
              description: t("features.items.feelings.description"),
            },
            {
              id: "feature-behaviors",
              title: t("features.items.behaviors.title"),
              description: t("features.items.behaviors.description"),
            },
            {
              id: "feature-export",
              title: t("features.items.export.title"),
              description: t("features.items.export.description"),
            },
            {
              id: "feature-saved",
              title: t("features.items.saved.title"),
              description: t("features.items.saved.description"),
            },
          ]}
        />
      </main>

      <PageFooter />
    </div>
  );
}
