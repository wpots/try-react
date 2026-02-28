import { IconTile, Label } from "@repo/ui";
import { MessageSquareText, MonitorSmartphone, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { CallToAction } from "@/components/CallToAction";
import { PageHero } from "@/components/PageHero";
import { ProductFeatures } from "@/components/ProductFeatures";
import { USPSection } from "@/components/USPSection";

import type { LandingPageProps } from "./index";

export function LandingPage({ id = "main-content", ...props }: LandingPageProps): React.JSX.Element {
  const t = useTranslations("landing");

  return (
    <>
      <main data-component-type="LandingPage" id={id} {...props}>
        <PageHero className="md:pt-ds-5xl pt-ds-4xl" />
        <ProductFeatures
          eyebrow={<Label>{t("features.eyebrow")}</Label>}
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
          variant="knockout"
          title={t("cta.primary.title")}
          description={t("cta.primary.description")}
          linkLabel={t("cta.primary.button")}
          linkHref="/dashboard"
          eyebrow={<IconTile icon={MonitorSmartphone} className="mx-auto" variant="strong" />}
        />

        <USPSection
          items={[
            {
              id: "usp-simple",
              icon: Sparkles,
              title: t("usp.simple.title"),
              description: t("usp.simple.description"),
            },
            {
              id: "usp-accessible",
              icon: MonitorSmartphone,
              title: t("usp.accessible.title"),
              description: t("usp.accessible.description"),
            },
            {
              id: "usp-safe",
              icon: ShieldCheck,
              title: t("usp.safe.title"),
              description: t("usp.safe.description"),
            },
          ]}
        />

        <CallToAction
          id="cta-feedback"
          variant="default"
          title={t("cta.feedback.title")}
          description={t("cta.feedback.description")}
          linkLabel={t("cta.feedback.button")}
          linkHref="/feedback"
          eyebrow={<Label>{t("cta.feedback.eyebrow")}</Label>}
        >
          <IconTile icon={MessageSquareText} className="mx-auto" variant="strong" />
        </CallToAction>
      </main>
    </>
  );
}
