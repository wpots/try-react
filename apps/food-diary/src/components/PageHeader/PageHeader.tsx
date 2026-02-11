"use client";

import { useEffect, useMemo, useState } from "react";
import { HamburgerMenu, Navigation } from "@repo/ui";
import { useTranslations } from "next-intl";

import type { PageHeaderProps } from "./index";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/navigation";
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

export function PageHeader({
  className,
  id = "page-header",
  ...props
}: PageHeaderProps): React.JSX.Element {
  const t = useTranslations("landing.nav");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrollThreshold(100);

  const navItems = useMemo(
    () => [
      {
        id: "more-info-link",
        href: "#cta-primary",
        label: t("moreInfo"),
      },
      {
        id: "getting-started-link",
        href: "#cta-primary",
        label: t("gettingStarted"),
      },
      {
        id: "feedback-link",
        href: "#cta-feedback",
        label: t("feedback"),
      },
    ],
    [t],
  );

  return (
    <header
      data-component-type="PageHeader"
      id={id}
      className={classnames(
        "fixed inset-x-0 top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        isScrolled
          ? "bg-ds-surface text-ds-on-surface-strong shadow-ds-sm"
          : "bg-transparent text-ds-on-primary",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-ds-m px-ds-l py-ds-s md:px-ds-xl">
        <Logo
          id="page-header-logo"
          href="#home"
          className={classnames(
            isScrolled ? "text-ds-on-surface-strong" : "text-ds-on-primary",
          )}
        />

        <Navigation
          items={navItems}
          className="hidden md:block"
          itemClassName={classnames(
            "font-medium",
            isScrolled ? "text-ds-on-surface-strong" : "text-ds-on-primary",
          )}
        />

        <HamburgerMenu
          buttonLabel={t("menuButtonLabel")}
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen((prev) => !prev)}
          buttonClassName={classnames(
            isScrolled
              ? "border-ds-border bg-ds-surface"
              : "border-ds-on-primary/40 bg-ds-on-primary/10",
          )}
        >
          <div className="grid gap-ds-s">
            <a
              href="#cta-primary"
              className="rounded-ds-sm px-ds-s py-ds-xs text-ds-on-surface hover:bg-ds-surface-subtle"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("gettingStarted")}
            </a>
            <a
              href="#cta-feedback"
              className="rounded-ds-sm px-ds-s py-ds-xs text-ds-on-surface hover:bg-ds-surface-subtle"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("feedback")}
            </a>
            <Link
              href="/auth/login"
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
      </div>
    </header>
  );
}
