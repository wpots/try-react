import type { CardHeaderProps } from "../index";
import { cn } from "../../../lib/utils";

export function CardHeader({
  title,
  description,
  className,
  children,
  ...props
}: CardHeaderProps): React.JSX.Element {
  return (
    <div className={cn("space-y-ds-xs", className)} {...props}>
      {title ? <div className="font-ds-heading-md">{title}</div> : null}
      {description ? (
        <div className="text-ds-on-surface-secondary">{description}</div>
      ) : null}
      {children}
    </div>
  );
}
