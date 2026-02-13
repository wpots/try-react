import { useTranslations } from "next-intl";
import type { LandingPageProps } from "./index";

import { CallToAction } from "@/components/CallToAction";
import { PageHero } from "@/components/PageHero";
import { ProductFeatures } from "@/components/ProductFeatures";
import { USPSection } from "@/components/USPSection";

export function LandingPage({ id = "main-content", ...props }: LandingPageProps): React.JSX.Element {
  const t = useTranslations("landing");

  return (
    <>
      <main data-component-type="LandingPage" id={id} {...props}>
        <PageHero className="md:pt-ds-5xl" />
        <ProductFeatures
          eyebrow={t("features.eyebrow")}
          heading={t("features.heading")}
          description={t("features.description")}
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
      </main>
    </>
  );
}
