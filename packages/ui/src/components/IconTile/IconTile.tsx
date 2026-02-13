import type { IconTileProps } from "./index";
import { cn } from "../../lib/utils";

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
} as const;

const variantClasses = {
  default: "bg-ds-surface-primary/30 text-ds-on-surface-subtle",
  strong: "bg-ds-surface-strong/30 text-ds-on-surface",
  subtle: "bg-ds-surface-subtle/30 text-ds-on-surface",
} as const;

export function IconTile({
  icon: Icon,
  className,
  size = "md",
  variant = "default",
  ...props
}: IconTileProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-ds-lg",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}
