import { Container, Section, Typography } from "@repo/ui";

import type { USPSectionProps } from "./index";

import classnames from "@/utils/classnames/classnames";

export function USPSection({
  items,
  className,
  id = "usp-section",
  ...props
}: USPSectionProps): React.JSX.Element {
  return (
    <Section
      data-component-type="USPSection"
      id={id}
      spacing="default"
      className={classnames("bg-ds-surface", className)}
      {...props}
    >
      <Container size="default">
        <div className="grid gap-ds-l md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-ds-lg border border-ds-border bg-ds-surface-elevated p-ds-l"
            >
              <img
                src={item.iconSrc}
                alt=""
                aria-hidden
                className="h-12 w-12"
              />
              <Typography
                tag="h3"
                variant="heading"
                size="sm"
                className="mt-ds-s text-ds-on-surface-strong"
              >
                {item.title}
              </Typography>
              <Typography
                tag="p"
                variant="body"
                size="base"
                className="mt-ds-xs text-ds-on-surface"
              >
                {item.description}
              </Typography>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
