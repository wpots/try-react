"use client";

import { Card, CardActions, CardHeader, Container, IconTile, Link, Section, Typography } from "@repo/ui";

import type { CallToActionProps } from "./index";

import { Link as I18nLink } from "@/i18n/navigation";
import classnames from "@/utils/classnames/classnames";
import { ArrowRight, Icon, Info } from "lucide-react";

const SECTION_VARIANTS: Record<NonNullable<CallToActionProps["variant"]>, string> = {
  default: "bg-ds-surface",
  strong: "bg-ds-brand-primary-soft",
  knockout: "bg-ds-brand-ink",
};

export function CallToAction({
  variant = "default",
  title,
  description,
  linkLabel,
  linkHref,
  className,
  id = "cta-section",
  ...props
}: CallToActionProps): React.JSX.Element {
  return (
    <Section
      data-component-type="CallToAction"
      id={id}
      spacing="default"
      className={classnames(SECTION_VARIANTS[variant], className)}
      {...props}
    >
      <Container size="default">
        <Card variant="knockout" className="flex flex-col gap-ds-xl items-center">
          <CardHeader className="flex flex-col gap-ds-xl items-center text-center">
            <IconTile icon={Info} size="md" className="text-ds-brand-primary" />
            <Typography tag="h2" variant="heading" size={{ base: "md", md: "xl" }}>
              {title}
            </Typography>
            <Typography variant="body" size={{ base: "base", md: "lg" }}>
              {description}
            </Typography>
          </CardHeader>
          <CardActions>
            <Link as={I18nLink} href={linkHref} variant="secondary" size="lg">
              {linkLabel} <ArrowRight />
            </Link>
          </CardActions>
        </Card>
      </Container>
    </Section>
  );
}
