import type { LabelProps } from "./index";

import { cn } from "../../lib/utils";
import { Typography } from "../Typography";
const labelBaseClasses = "inline-flex items-center font-medium";
const labelVariantClasses: Record<NonNullable<LabelProps["variant"]>, string> = {
  default: "text-ds-primary uppercase tracking-wider",
  pill: "rounded-ds-full px-ds-l py-ds-s text-ds-on-surface-subtle bg-ds-surface-primary/30",
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
