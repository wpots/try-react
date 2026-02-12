import type { LabelProps } from "./index";

import { cn } from "../../lib/utils";
import { Typography } from "../Typography";
const labelBaseClasses = "inline-flex items-center";
const labelVariantClasses: Record<NonNullable<LabelProps["variant"]>, string> = {
  default: "text-ds-on-surface-secondary",
  pill: [
    "rounded-ds-full px-ds-m py-ds-xs text-sm",
    "font-medium text-ds-on-surface-strong",
    "bg-ds-brand-primary/40 ring-1 ring-ds-brand-primary/70",
  ].join(" "),
};

export function Label({ className, variant = "default", ...props }: LabelProps): React.JSX.Element {
  return (
    <Typography
      tag="span"
      data-component-type="Label"
      className={cn(labelBaseClasses, labelVariantClasses[variant], className)}
      variant="body"
      size="sm"
    >
      {props.children}
    </Typography>
  );
}
