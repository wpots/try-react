"use client";

import { useEffect, useState } from "react";
import { HamburgerMenu, Link, Navigation } from "@repo/ui";
import { useTranslations } from "next-intl";

import type { PageHeaderProps } from "./index";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { Link as I18nLink } from "@/i18n/navigation";
import classnames from "@/utils/classnames/classnames";

function useScrollThreshold(threshold: number): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll(): void {
      setIsScrolled(window.scrollY >= threshold);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isScrolled;
}

export function PageHeader({ className, id = "page-header", ...props }: PageHeaderProps): React.JSX.Element {
  const t = useTranslations("landing.nav");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrollThreshold(100);

  const itemClassName = classnames("font-medium", isScrolled ? "text-ds-on-surface-strong" : "text-ds-on-primary");

  const navItems = [
    { id: "more-info-link", href: "#cta-primary", labelKey: "moreInfo" as const },
    { id: "getting-started-link", href: "#cta-primary", labelKey: "gettingStarted" as const },
    { id: "feedback-link", href: "#cta-feedback", labelKey: "feedback" as const },
  ];

  return (
    <header
      data-component-type="PageHeader"
      id={id}
      className={classnames(
        "fixed inset-x-0 top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        "flex items-center justify-between px-ds-l",
        isScrolled ? "bg-ds-surface text-ds-on-surface-strong shadow-ds-sm" : "bg-transparent text-ds-on-primary",
        className,
      )}
      {...props}
    >
      <Logo
        id="page-header-logo"
        showText={isScrolled}
        href="#home"
        className={classnames(isScrolled ? "text-ds-on-surface-strong" : "text-ds-on-primary")}
      />

      <Navigation className="hidden md:block">
        {navItems.map(item => (
          <Navigation.Item key={item.id} id={item.id} href={item.href} className={itemClassName}>
            {t(item.labelKey)}
          </Navigation.Item>
        ))}
      </Navigation>

      <HamburgerMenu
        buttonLabel={t("menuButtonLabel")}
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(prev => !prev)}
        buttonClassName={classnames(
          isScrolled ? "border-ds-border bg-ds-surface" : "border-ds-on-primary/40 bg-ds-on-primary/10",
        )}
      >
        <div className="grid gap-ds-s">
          {navItems.map(item => (
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
    </header>
  );
}
