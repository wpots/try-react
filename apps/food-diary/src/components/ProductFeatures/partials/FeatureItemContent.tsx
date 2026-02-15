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
  variant, // reserved for future desktop/mobile layout variants
}: FeatureItemContentProps): React.JSX.Element {
  const Icon = option.icon;
  void variant;
  return (
    <div className="flex items-start gap-ds-m">
      <IconTile
        icon={Icon}
        variant={option.variant}
        className={isActive ? "scale-110 transition-transform duration-300" : undefined}
        size="md"
      />
      <div className="flex flex-col gap-ds-s">
        <Typography tag="h3" variant="heading" size="xs">
          {item.title}
        </Typography>
        <Typography tag="p" variant="body" size="sm" className="text-ds-on-surface-muted">
          {item.description}
        </Typography>
      </div>
    </div>
  );
}
