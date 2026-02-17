import { Card, Container, IconTile, Label, Section, Typography } from "@repo/ui";
import { LockKeyhole, MonitorSmartphone, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthButtons } from "@/components/AuthButtons";

export default function LoginPage(): React.JSX.Element {
  const t = useTranslations("auth");
  const loginHighlights = [
    {
      id: "sync",
      icon: MonitorSmartphone,
      title: t("loginHighlights.syncTitle"),
      description: t("loginHighlights.syncDescription"),
    },
    {
      id: "privacy",
      icon: LockKeyhole,
      title: t("loginHighlights.privacyTitle"),
      description: t("loginHighlights.privacyDescription"),
    },
    {
      id: "guest",
      icon: Sparkles,
      title: t("loginHighlights.guestTitle"),
      description: t("loginHighlights.guestDescription"),
    },
  ];

  return (
    <main id="main-content">
      <Section
        spacing="none"
        className="relative overflow-hidden py-ds-3xl md:py-ds-5xl"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ds-surface-primary/20 via-ds-surface to-ds-surface-muted" />
        <Container
          size="wide"
          className="relative grid items-start gap-ds-l lg:grid-cols-2"
        >
          <Card variant="knockout" className="items-start gap-ds-l">
            <Label variant="pill">{t("loginEyebrow")}</Label>
            <div className="grid gap-ds-s">
              <Typography
                tag="h1"
                variant="heading"
                size={{ base: "lg", md: "xl" }}
              >
                {t("loginTitle")}
              </Typography>
              <Typography
                tag="p"
                variant="body"
                size={{ base: "base", md: "lg" }}
                className="text-ds-on-surface-muted"
              >
                {t("loginSubtitle")}
              </Typography>
            </div>

            <div className="grid w-full gap-ds-m sm:grid-cols-2 xl:grid-cols-3">
              {loginHighlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <Card
                    key={highlight.id}
                    variant="soft"
                    className="h-full items-start gap-ds-s p-ds-m md:p-ds-l"
                  >
                    <IconTile icon={Icon} size="sm" variant="strong" />
                    <Typography tag="h2" variant="heading" size="xs">
                      {highlight.title}
                    </Typography>
                    <Typography
                      tag="p"
                      variant="body"
                      size="sm"
                      className="text-ds-on-surface-muted"
                    >
                      {highlight.description}
                    </Typography>
                  </Card>
                );
              })}
            </div>
          </Card>

          <div className="grid justify-items-center lg:justify-items-end">
            <AuthButtons redirectPath="/dashboard" />
          </div>
        </Container>
      </Section>
    </main>
  );
}
