"use client";

import { Button, Card, CardActions, CardHeader, Container, Section, Typography } from "@repo/ui";

import type { CallToActionProps } from "./index";

import { useRouter } from "@/i18n/navigation";
import classnames from "@/utils/classnames/classnames";

const SECTION_VARIANTS: Record<NonNullable<CallToActionProps["variant"]>, string> = {
  default: "bg-ds-surface",
  strong: "bg-ds-brand-primary-soft",
  knockout: "bg-ds-brand-ink",
};

export function CallToAction({
  variant = "default",
  title,
  description,
  buttonLabel,
  buttonHref,
  className,
  id = "cta-section",
  ...props
}: CallToActionProps): React.JSX.Element {
  const router = useRouter();

  return (
    <Section
      data-component-type="CallToAction"
      id={id}
      spacing="default"
      className={classnames(SECTION_VARIANTS[variant], className)}
      {...props}
    >
      <Container size="default">
        <Card variant="knockout">
          <CardHeader>
            <Typography tag="h2" variant="heading" size={{ base: "md", md: "xl" }}>
              {title}
            </Typography>
            <Typography variant="body" size={{ base: "base", md: "lg" }}>
              {description}
            </Typography>
          </CardHeader>

          <Button variant="secondary" size="lg" onClick={() => router.push(buttonHref)}>
            {buttonLabel}
          </Button>
        </Card>
      </Container>
    </Section>
  );
}
