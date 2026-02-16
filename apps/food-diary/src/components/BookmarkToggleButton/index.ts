import type { ToggleButtonProps } from "@repo/ui";

export interface BookmarkToggleButtonProps
  extends Omit<
    ToggleButtonProps,
    "aria-label" | "children" | "isSelected"
  > {
  addBookmarkLabel: string;
  isBookmarked: boolean;
  removeBookmarkLabel: string;
}

export { BookmarkToggleButton } from "./BookmarkToggleButton";
