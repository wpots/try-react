"use client";

import { HeaderNav } from "@/components/HeaderNav";
import { PageHeader } from "@/components/PageHeader";
import { PageFooter } from "@/components/PageFooter/PageFooter";
import { useHomeAuthRedirect } from "@/hooks/useHomeAuthRedirect";
import { LandingPage } from "@/templates/LandingPage";
import { Quote } from "@/components/Quote";
import { SectionHeader } from "@/components/SectionHeader";
import { useTranslations } from "next-intl";

export default function HomePage(): React.JSX.Element {
  useHomeAuthRedirect();
  const t = useTranslations("common.brand");
  return (
    <>
      <PageHeader>
        <HeaderNav />
      </PageHeader>
      <LandingPage />
      <PageFooter>
        <SectionHeader
          id="footer-brand"
          heading={t("tagline")}
          description={t("description")}
          headingVariant="script"
          headingTag="h4"
          className="items-center"
        >
          <Quote>{t("quote")}</Quote>
        </SectionHeader>
      </PageFooter>
    </>
  );
}
