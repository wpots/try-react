import { Container, Section, Typography } from "@repo/ui";
import { Card, IconTile } from "@repo/ui";

import type { USPSectionProps } from "./index";

import classnames from "@/utils/classnames/classnames";

export function USPSection({ items, className, id = "usp-section", ...props }: USPSectionProps): React.JSX.Element {
  return (
    <Section
      data-component-type="USPSection"
      id={id}
      spacing="default"
      className={classnames("bg-ds-surface", className)}
      {...props}
    >
      <Container size="default">
        <div className="grid gap-ds-xl md:grid-cols-3">
          {items.map(item => (
            <Card key={item.id} variant="soft" className="text-center">
              <IconTile icon={item.icon} />
              <Typography tag="h3" variant="heading" size="sm">
                {item.title}
              </Typography>
              <Typography tag="p" variant="body" size="base">
                {item.description}
              </Typography>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
