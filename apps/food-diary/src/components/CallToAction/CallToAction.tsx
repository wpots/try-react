"use client";

import { Card, CardActions, CardHeader, cn, Container, IconTile, Link, Section, Typography } from "@repo/ui";

import type { CallToActionProps } from "./index";

import { Link as I18nLink } from "@/i18n/navigation";

import { ArrowRight } from "lucide-react";
const ctaVariantNames = {
  default: "flex-row gap-ds-5xl items-end",
  knockout: "flex-col gap-ds-xl items-center text-center",
};
export function CallToAction({
  variant = "default",
  children,
  title,
  description,
  linkLabel,
  linkHref,
  className,
  eyebrow,
  id = "cta-section",
  ...props
}: CallToActionProps): React.JSX.Element {
  const isDefault = variant === "default";
  return (
    <Section data-component-type="CallToAction" id={id}>
      <Container>
        <Card
          variant={variant === "default" ? "soft" : "knockout"}
          className={cn("flex", ctaVariantNames[variant], className)}
        >
          <CardHeader className="flex flex-col gap-ds-xl">
            {eyebrow}
            <Typography tag="h2" variant="heading" size={{ base: "md", md: "xl" }}>
              {title}
            </Typography>
            <Typography variant="body" size={{ base: "base", md: "lg" }}>
              {description}
            </Typography>
          </CardHeader>
          <div>
            {children}
            <Link
              as={I18nLink}
              href={linkHref}
              variant={isDefault ? "strong" : "secondary"}
              size={isDefault ? "lg" : undefined}
            >
              {linkLabel}
              {!isDefault && <ArrowRight />}
            </Link>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
