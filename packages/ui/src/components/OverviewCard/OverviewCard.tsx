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
        "min-w-0 rounded-lg border border-border bg-surface p-4",
        className,
      )}
    >
      <h4 className="text-lg font-semibold text-ds-text">{title}</h4>
      {subtitle ? <p className="mt-1 text-sm text-ds-text-muted">{subtitle}</p> : null}
      {description ? <p className="mt-2 text-sm text-ds-text">{description}</p> : null}
      {children ? <div className="mt-3">{children}</div> : null}
      {footer ? <footer className="mt-4">{footer}</footer> : null}
    </article>
  );
}
