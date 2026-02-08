import type { OverviewCardProps } from "./index";
import { cn } from "../../lib/utils";

export function OverviewCard({
  title,
  subtitle,
  description,
  children,
  footer,
  className,
}: OverviewCardProps) {
  return (
    <article
      className={cn(
        "min-w-0 rounded-lg border border-border-300 bg-surface-50 p-4",
        className,
      )}
    >
      <h4 className="text-lg font-semibold text-text-900">{title}</h4>
      {subtitle ? <p className="mt-1 text-sm text-text-700">{subtitle}</p> : null}
      {description ? <p className="mt-2 text-sm text-text-900">{description}</p> : null}
      {children ? <div className="mt-3">{children}</div> : null}
      {footer ? <footer className="mt-4">{footer}</footer> : null}
    </article>
  );
}
