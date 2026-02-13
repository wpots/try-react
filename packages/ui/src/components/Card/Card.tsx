import type { CardProps } from "./index";
import { cn } from "../../lib/utils";

const cardBaseClasses =
  "rounded-ds-xl border p-ds-m transition-all duration-300 md:p-ds-xxl";

const cardVariantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "border-ds-border-subtle bg-ds-surface",
  soft: "border-ds-border-subtle bg-ds-surface-subtle",
  strong: "border-transparent bg-ds-brand-primary-soft",
  knockout: "border-transparent bg-ds-brand-ink text-ds-on-primary",
};

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        cardBaseClasses,
        cardVariantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
