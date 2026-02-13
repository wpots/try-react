import { IconTile, Typography } from "@repo/ui";

import type { ProductFeatureItem } from "../index";
import type { FeatureOption } from "../utils/featureOptions";

export interface FeatureItemContentProps {
  item: ProductFeatureItem;
  option: FeatureOption;
  isActive?: boolean;
  variant: "desktop" | "mobile";
}

/** Shared feature card content (icon + title + description) for desktop and mobile. */
export function FeatureItemContent({
  item,
  option,
  isActive = false,
  variant,
}: FeatureItemContentProps): React.JSX.Element {
  const Icon = option.icon;

  if (variant === "mobile") {
    return (
      <div className="flex items-start gap-ds-m">
        <IconTile icon={Icon} variant={option.variant} size="sm" />
        <div>
          <h3 className="font-ds-heading-sm text-ds-on-surface">{item.title}</h3>
          <p className="mt-ds-xs font-ds-body-sm text-ds-on-surface-muted leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-ds-m">
      <IconTile
        icon={Icon}
        variant={option.variant}
        className={isActive ? "scale-110 transition-transform duration-300" : undefined}
        size="md"
      />
      <div>
        <Typography tag="h3" variant="heading" size={{ base: "md", md: "lg" }}>
          {item.title}
        </Typography>
        <Typography tag="p" variant="body" size={{ base: "base", md: "lg" }}>
          {item.description}
        </Typography>
      </div>
    </div>
  );
}
