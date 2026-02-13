import type { CardActionsProps } from "../index";
import { cn } from "../../../lib/utils";

const actionAlignClasses: Record<NonNullable<CardActionsProps["align"]>, string> =
  {
    start: "justify-start",
    end: "justify-end",
    between: "justify-between",
  };

export function CardActions({
  className,
  align = "end",
  ...props
}: CardActionsProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "mt-ds-l flex items-center gap-ds-s",
        actionAlignClasses[align],
        className,
      )}
      {...props}
    />
  );
}
