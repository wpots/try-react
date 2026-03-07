import { Card, Container, Section, Typography } from "@repo/ui";
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

type LoginPageProps = {
  searchParams: Promise<{ deleted?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps): Promise<React.JSX.Element> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "auth" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const { deleted } = await searchParams;
  const hasDeletedAccount = deleted === "1";

  return (
    <main id="main-content" className="flex min-h-dvh flex-col">
      <PageHeader backAriaLabel={tNav("home")} backHref="/" showBookmarkButton={false} />
      <Section>
        <Container className="relative grid items-start gap-ds-l lg:grid-cols-2">
          <Typography tag="h1" variant="heading" size={{ base: "lg", md: "xl" }}>
            {t("loginTitle")}
          </Typography>
          <Card variant="knockout" className="gap-ds-l">
            {hasDeletedAccount ? (
              <Typography variant="body" className="rounded-ds-sm bg-ds-success/15 p-ds-s text-ds-on-surface">
                {t("accountDeletedSuccess")}
              </Typography>
            ) : null}
            <div className="grid gap-ds-s">
              <AuthButtons redirectPath="/dashboard" />
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
