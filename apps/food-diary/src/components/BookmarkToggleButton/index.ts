import type { ToggleButtonProps } from "@repo/ui";

export interface BookmarkToggleButtonProps
  extends Omit<
    ToggleButtonProps,
    "aria-label" | "children" | "isSelected" | "onChange"
  > {
  addBookmarkLabel: string;
  isBookmarked: boolean;
  onToggle?: (isBookmarked: boolean) => void;
  removeBookmarkLabel: string;
}

export { BookmarkToggleButton } from "./BookmarkToggleButton";
