import { Card, Container, Section, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { AuthButtons } from "@/components/AuthButtons";
import { PageHeader } from "@/components/PageHeader";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "auth" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("loginTitle")} — ${tCommon("brand.tagline")}`,
  };
}

export default function LoginPage(): React.JSX.Element {
  const t = useTranslations("auth");
  const tNav = useTranslations("nav");

  return (
    <main id="main-content" className="flex min-h-dvh flex-col">
      <PageHeader backAriaLabel={tNav("home")} backHref="/" showBookmarkButton={false} />
      <Section>
        <Container className="relative grid items-start gap-ds-l lg:grid-cols-2">
          <Typography tag="h1" variant="heading" size={{ base: "lg", md: "xl" }}>
            {t("loginTitle")}
          </Typography>
          <Card variant="knockout" className="gap-ds-l">
            <div className="grid gap-ds-s">
              <AuthButtons redirectPath="/dashboard" />
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
