import type { LabelProps } from "./index";

import { cn } from "../../lib/utils";
import { Typography } from "../Typography";
const labelBaseClasses = "inline-flex items-center font-medium";
const labelVariantClasses: Record<NonNullable<LabelProps["variant"]>, string> = {
  default: "text-ds-primary uppercase tracking-wider",
  pill: [
    "rounded-ds-full px-ds-m py-ds-xs",
    "text-ds-on-surface-accent",
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
