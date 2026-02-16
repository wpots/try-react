export interface EntryPageHeaderProps extends React.ComponentProps<"header"> {
  backHref?: string;
  onBackClick?: React.MouseEventHandler<HTMLButtonElement>;
  isBookmarked?: boolean;
  onBookmarkClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export { EntryPageHeader } from "./EntryPageHeader";
