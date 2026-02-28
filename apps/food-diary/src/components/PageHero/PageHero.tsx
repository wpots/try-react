import { AnimatedLogo, Container, Label, Link, Section, Typography, cn } from "@repo/ui";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { PageHeroProps } from "./index";
import type { LinkProps } from "@repo/ui";

export function PageHero({ className, id = "hero-section" }: PageHeroProps): React.JSX.Element {
  const t = useTranslations("landing.hero");
  const ctaButtons: LinkProps[] = [
    { href: "/dashboard", children: t("primaryCta"), variant: "default" },
    { href: "#features", children: t("secondaryCta"), variant: "outline" },
  ];
  return (
    <Section data-component-type="PageHero" id={id} className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ds-surface-primary/30 via-ds-surface to-ds-surface" />
      <Container className="relative z-1 flex flex-col items-center gap-ds-xl lg:flex-row lg:gap-ds-2xl">
        {/* Visual column - animated brand logo */}
        <div className="flex flex-1 items-center justify-center lg:justify-end lg:order-1">
          <AnimatedLogo className="size-full max-w-md" />
        </div>
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left gap-ds-3xl">
          <Label variant="pill" className="-mb-ds-m">
            {t("eyebrow")}
          </Label>

          <Typography tag="h1" variant="heading" size={{ base: "lg", sm: "2xl" }}>
            {t("title")}
          </Typography>

          <Typography tag="p" variant="body" size={{ base: "base", md: "xl" }} className="!text-ds-on-surface-muted">
            {t("subtitle")}
          </Typography>

          <div className="mt-8 flex flex-col gap-ds-m sm:flex-row">
            {ctaButtons.map((button) => {
              const isPrimary = button.variant === "default";
              return (
                <Link
                  key={button.href}
                  href={button.href}
                  variant={button.variant}
                  className={isPrimary ? "group" : undefined}
                >
                  {button.children}
                  {isPrimary && <ArrowRight />}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
