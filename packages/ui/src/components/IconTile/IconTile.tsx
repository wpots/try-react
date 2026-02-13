import type { IconTileProps } from "./index";
import { cn } from "../../lib/utils";

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
} as const;

export function IconTile({
  icon: Icon,
  className,
  size = "sm",
  ...props
}: IconTileProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-ds-xl",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <Icon className="h-5 w-5" />
    </div>
  );
}
