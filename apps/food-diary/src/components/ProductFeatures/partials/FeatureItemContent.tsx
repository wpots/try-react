import { Typography } from "@repo/ui";

import type { ProductFeatureItem } from "../index";
import type { FeatureOption } from "../utils/featureOptions";

import classnames from "@/utils/classnames/classnames";

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
        <div
          className={classnames(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-ds-xl",
            option.colorClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
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
      <div
        className={classnames(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-ds-xl transition-transform duration-300",
          option.colorClass,
          isActive ? "scale-110" : "",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
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
