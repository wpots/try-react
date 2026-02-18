import { Card, Container, Label, Section, Typography } from "@repo/ui";
import { useTranslations } from "next-intl";
import { AuthButtons } from "@/components/AuthButtons";
import { PageHeader } from "@/components/PageHeader";

export default function LoginPage(): React.JSX.Element {
  const t = useTranslations("auth");
  const tNav = useTranslations("nav");

  return (
    <main id="main-content" className="flex min-h-dvh flex-col">
      <PageHeader backAriaLabel={tNav("home")} backHref="/" showBookmarkButton={false} />
      <Section>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ds-surface-primary/20 via-ds-surface to-ds-surface-muted" />
        <Container size="wide" className="relative grid items-start gap-ds-l lg:grid-cols-2">
          <Card variant="knockout" className="items-start gap-ds-l">
            <Label variant="pill">{t("loginEyebrow")}</Label>
            <div className="grid gap-ds-s">
              <Typography tag="h1" variant="heading" size={{ base: "lg", md: "xl" }}>
                {t("loginTitle")}
              </Typography>
              <Typography tag="p" variant="body" size={{ base: "base", md: "lg" }} className="text-ds-on-surface-muted">
                {t("loginSubtitle")}
              </Typography>
              <AuthButtons redirectPath="/dashboard" />
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
