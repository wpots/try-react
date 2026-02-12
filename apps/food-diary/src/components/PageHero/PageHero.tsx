import { AnimatedLogo, Container, Label, Typography, Section } from "@repo/ui";
import { Link, type LinkProps } from "@repo/ui";

import { useTranslations } from "next-intl";

import type { PageHeroProps } from "./index";

import classnames from "@/utils/classnames/classnames";

export function PageHero({ className, id = "hero-section", ...props }: PageHeroProps): React.JSX.Element {
  const t = useTranslations("landing.hero");
  const ctaButtons: LinkProps[] = [
    { href: "/entry/create", children: t("primaryCta"), variant: "default" },
    { href: "#features", children: t("secondaryCta"), variant: "outline" },
  ];
  return (
    <Section data-component-type="PageHero" id={id} className={classnames("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ds-surface-primary-start via-ds-surface to-ds-surface" />
      <Container size="wide" className="relative z-1 flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left gap-ds-l">
          <Label variant="pill">{t("eyebrow")}</Label>

          <Typography tag="h1" variant="heading" size={{ base: "xl", sm: "2xl" }}>
            {t("title")}
          </Typography>

          <Typography tag="p" variant="body" size={{ base: "lg", md: "xl" }} className="!text-ds-on-surface-muted">
            {t("subtitle")}
          </Typography>

          <div className="mt-8 flex flex-col gap-ds-m sm:flex-row">
            {ctaButtons.map(button => (
              <Link key={button.href} href={button.href} variant={button.variant}>
                {button.children}
              </Link>
            ))}
          </div>
        </div>
        {/* Visual column - animated brand logo */}
        <div className="flex flex-1 items-center justify-center lg:justify-end">
          <AnimatedLogo />
        </div>
      </Container>
    </Section>
  );
}
