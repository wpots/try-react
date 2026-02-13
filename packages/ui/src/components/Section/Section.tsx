import type { SectionProps } from "./index";

import { cn } from "../../lib/utils";

const VARIANT_CLASSNAMES: Record<NonNullable<SectionProps["variant"]>, string> = {
  default: "bg-ds-surface text-ds-on-surface",
  neutral: "bg-ds-surface-muted text-ds-on-surface",
  strong: "bg-ds-brand-primary-soft text-ds-on-surface-strong",
  knockout: "bg-ds-brand-ink text-ds-on-primary",
};

const SPACING_CLASSNAMES: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  default: "py-ds-xl md:py-ds-4xl",
  "bottom-space": "pb-ds-xl md:pb-ds-4xl",
  "merge-content": "-mt-ds-xl pb-ds-xl md:-mt-ds-4xl md:pb-ds-4xl",
};

export function Section({
  children,
  variant = "default",
  spacing = "default",
  className,
  as: Component = "section",
  ...props
}: SectionProps): React.JSX.Element {
  return (
    <Component className={cn(VARIANT_CLASSNAMES[variant], SPACING_CLASSNAMES[spacing], className)} {...props}>
      {children}
    </Component>
  );
}
