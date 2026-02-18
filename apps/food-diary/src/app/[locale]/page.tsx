"use client";

import { useTranslations } from "next-intl";

import { AnimatedPageHeader } from "@/components/AnimatedPageHeader";
import { HeaderNav } from "@/components/HeaderNav";
import { PageFooter } from "@/components/PageFooter/PageFooter";
import { Quote } from "@/components/Quote";
import { SectionHeader } from "@/components/SectionHeader";
import { useHomeAuthRedirect } from "@/hooks/useHomeAuthRedirect";
import { LandingPage } from "@/templates/LandingPage";


const NAV_ITEMS = [
  { id: "more-info-link", href: "#cta-primary", labelKey: "moreInfo" },
  { id: "getting-started-link", href: "#cta-primary", labelKey: "gettingStarted" },
  { id: "feedback-link", href: "#cta-feedback", labelKey: "feedback" },
];

export default function HomePage(): React.JSX.Element {
  useHomeAuthRedirect();
  const t = useTranslations("common.brand");
  const cms = {
    headerNav: useTranslations("landing.nav"),
  };
  const navItems = NAV_ITEMS.map(item => ({
    id: item.id,
    href: item.href,
    children: cms.headerNav(item.labelKey),
  }));
  return (
    <>
      <AnimatedPageHeader>
        <HeaderNav navItems={navItems} cms={cms.headerNav} />
      </AnimatedPageHeader>
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
