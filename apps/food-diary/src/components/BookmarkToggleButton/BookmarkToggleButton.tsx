import { Bookmark } from "lucide-react";
import { cn, ToggleButton } from "@repo/ui";

import type { BookmarkToggleButtonProps } from "./index";

export function BookmarkToggleButton({
  addBookmarkLabel,
  className,
  isBookmarked,
  onToggle,
  removeBookmarkLabel,
  ...props
}: BookmarkToggleButtonProps): React.JSX.Element {
  return (
    <ToggleButton
      aria-label={isBookmarked ? removeBookmarkLabel : addBookmarkLabel}
      className={cn(
        "inline-flex items-center justify-center",
        "h-8 w-8 rounded-ds-full border border-ds-border-subtle",
        "bg-transparent text-ds-on-surface-secondary",
        "transition-colors",
        "hover:border-ds-brand-zen hover:bg-ds-brand-zen/20",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isBookmarked && "border-ds-brand-zen text-ds-brand-zen",
        className,
      )}
      isSelected={isBookmarked}
      onChange={onToggle}
      {...props}
    >
      <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} aria-hidden="true" />
    </ToggleButton>
  );
}
