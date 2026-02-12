import { Container, Section, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";

import type { PageFooterProps } from "./index";

import { Brand } from "@/components/Brand";
import classnames from "@/utils/classnames/classnames";

export function PageFooter({ className, id = "page-footer", ...props }: PageFooterProps): React.JSX.Element {
  const t = useTranslations("landing.footer");

  return (
    <Section
      as="footer"
      data-component-type="PageFooter"
      id={id}
      className={classnames("bg-gradient-to-br from-ds-brand-primary-strong to-ds-brand-ink py-ds-4xl", className)}
      {...props}
    >
      <Container size="wide">
        <div className="grid gap-ds-xl md:grid-cols-3">
          <aside className="md:col-span-2">
            <Typography variant="body" size="base" className="text-ds-on-primary">
              {t("description")}
            </Typography>
          </aside>
          <Brand id="footer-brand" quote={t("quote")} tagline={t("tagline")} className="md:col-span-1" />
        </div>

        <div className="mt-ds-xl text-right">
          <Typography tag="small" variant="body" size="sm" className="text-ds-on-primary/80">
            {t("copyright")}
          </Typography>
        </div>
      </Container>
    </Section>
  );
}
