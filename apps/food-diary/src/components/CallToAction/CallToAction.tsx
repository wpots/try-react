"use client";

import { Button, Container, Section, Typography } from "@repo/ui";

import type { CallToActionProps } from "./index";

import { useRouter } from "@/i18n/navigation";
import classnames from "@/utils/classnames/classnames";

const SECTION_VARIANTS: Record<
  NonNullable<CallToActionProps["variant"]>,
  string
> = {
  default: "bg-ds-surface",
  strong: "bg-ds-brand-primary-soft",
  knockout: "bg-ds-brand-ink",
};

const BUTTON_VARIANTS: Record<
  NonNullable<CallToActionProps["variant"]>,
  "solid" | "ghost" | "outline"
> = {
  default: "solid",
  strong: "ghost",
  knockout: "outline",
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
        <div className="max-w-3xl">
          <Typography
            tag="h2"
            variant="heading"
            size={{ base: "md", md: "xl" }}
            className={classnames(
              variant === "knockout" ? "text-ds-on-primary" : "text-ds-on-surface-strong",
            )}
          >
            {title}
          </Typography>
          <Typography
            tag="p"
            variant="body"
            size={{ base: "base", md: "lg" }}
            className={classnames(
              "mt-ds-m",
              variant === "knockout" ? "text-ds-on-primary" : "text-ds-on-surface",
            )}
          >
            {description}
          </Typography>
          <div className="mt-ds-l">
            <Button
              variant={BUTTON_VARIANTS[variant]}
              size="lg"
              onClick={() => router.push(buttonHref)}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
