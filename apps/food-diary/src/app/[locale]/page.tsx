"use client";

import { useState } from "react";
import { HamburgerMenu, Link, Navigation, cn } from "@repo/ui";
import { PageHeader, usePageHeaderScroll } from "@/components/PageHeader";
import { PageFooter } from "@/components/PageFooter/PageFooter";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useHomeAuthRedirect } from "@/hooks/useHomeAuthRedirect";
import { Link as I18nLink } from "@/i18n/navigation";
import { LandingPage } from "@/templates/LandingPage";
import { useTranslations } from "next-intl";

const NAV_ITEMS = [
  { id: "more-info-link", href: "#cta-primary", labelKey: "moreInfo" as const },
  { id: "getting-started-link", href: "#cta-primary", labelKey: "gettingStarted" as const },
  { id: "feedback-link", href: "#cta-feedback", labelKey: "feedback" as const },
] as const;

function HeaderNav(): React.JSX.Element {
  const { isScrolled } = usePageHeaderScroll();
  const t = useTranslations("landing.nav");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Navigation className="hidden md:block">
        {NAV_ITEMS.map((item) => (
          <Navigation.Item
            key={item.id}
            id={item.id}
            href={item.href}
            className={cn(
              "font-medium",
              isScrolled ? "text-ds-on-surface-strong" : "text-ds-on-primary",
            )}
          >
            {t(item.labelKey)}
          </Navigation.Item>
        ))}
      </Navigation>

      <HamburgerMenu
        buttonLabel={t("menuButtonLabel")}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen((prev) => !prev)}
        buttonClassName={cn(
          isScrolled
            ? "border-ds-border bg-ds-surface"
            : "border-ds-on-primary/40 bg-ds-on-primary/10",
        )}
      >
        <div className="grid gap-ds-s">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              as={I18nLink}
              href={item.href}
              variant="link"
              className="rounded-ds-sm px-ds-s py-ds-xs text-ds-on-surface hover:bg-ds-surface-subtle"
              onClick={() => setIsMenuOpen(false)}
            >
              {t(item.labelKey)}
            </Link>
          ))}
          <Link
            as={I18nLink}
            href="/auth/login"
            variant="link"
            className="rounded-ds-sm px-ds-s py-ds-xs text-ds-on-surface hover:bg-ds-surface-subtle"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("login")}
          </Link>
          <div className="px-ds-s py-ds-xs">
            <LanguageSwitcher />
          </div>
        </div>
      </HamburgerMenu>
    </>
  );
}

export default function HomePage(): React.JSX.Element {
  useHomeAuthRedirect();

  return (
    <>
      <PageHeader>
        <HeaderNav />
      </PageHeader>
      <LandingPage />
      <PageFooter />
    </>
  );
}
