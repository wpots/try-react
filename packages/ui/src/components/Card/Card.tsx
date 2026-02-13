import type { CardProps } from "./index";
import { cn } from "../../lib/utils";

const cardBaseClasses =
  "relative flex flex-col gap-ds-xl items-center rounded-ds-xl border p-ds-m transition-all duration-300 md:p-ds-xxl";

const cardVariantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "border-ds-surface-muted bg-ds-surface",
  soft: "border-ds-border-subtle bg-ds-surface-muted text-ds-on-surface-muted",
  strong: "border-transparent bg-ds-brand-primary-soft",
  knockout: "border-transparent bg-gradient-to-br from-ds-surface-primary/15 to-ds-surface-primary/35",
};

export function Card({ className, variant = "default", children, ...props }: CardProps): React.JSX.Element {
  return (
    <div className={cn(cardBaseClasses, cardVariantClasses[variant], className)} {...props}>
      {variant === "knockout" && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-ds-brand-support/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-ds-brand-primary/20 blur-3xl" />
        </>
      )}
      {children}
    </div>
  );
}
