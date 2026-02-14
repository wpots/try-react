import { Container, Section, Typography, cn } from "@repo/ui";
import { useTranslations } from "next-intl";

import type { PageFooterProps } from "./index";

import { AnimatedLogo } from "@repo/ui";
import { Quote } from "@/components/Quote";
import { SectionHeader } from "@/components/SectionHeader";

export function PageFooter({ className, id = "page-footer", children, ...props }: PageFooterProps): React.JSX.Element {
  const t = useTranslations("landing.footer");

  return (
    <Section
      as="footer"
      data-component-type="PageFooter"
      id={id}
      className={cn(
        "relative bg-gradient-to-br from-ds-surface-muted to-ds-brand-neutral/20 border-t-1 border-ds-border",
        className,
      )}
      {...props}
    >
      <AnimatedLogo
        className="absolute left-1/2 top-ds-m z-0 w-32 h-32 -translate-x-1/2  pointer-events-none md:w-40 md:h-40"
        aria-hidden
      />
      <Container size="narrow" className="relative z-10 flex flex-col items-center gap-ds-xxl pt-ds-4xl text-center">
        {children}

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

        <hr className="w-[14rem] border-0 border-t border-ds-border" aria-hidden />

        <Typography tag="small" variant="body" size="sm" className="text-ds-on-surface-subtle">
          {t("copyright")}
        </Typography>
      </Container>
    </Section>
  );
}
