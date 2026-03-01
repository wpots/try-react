import { cn } from "@repo/ui";

import type { PageIndicatorProps } from "./index";

export function PageIndicator({
  count,
  activeIndex,
  className,
  "aria-label": ariaLabel,
  ...props
}: PageIndicatorProps): React.JSX.Element {
  return (
    <div
      className={cn("mt-ds-m flex items-center justify-center gap-ds-s", className)}
      aria-label={ariaLabel}
      {...props}
    >
      {Array.from({ length: count }, (_, idx) => (
        <div
          key={idx}
          className={cn(
            "h-1.5 rounded-ds-full transition-all duration-300",
            activeIndex === idx ? "w-6 bg-ds-primary" : "w-1.5 bg-ds-on-surface-secondary/20",
          )}
        />
      ))}
    </div>
  );
}
