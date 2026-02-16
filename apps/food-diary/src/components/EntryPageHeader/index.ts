export interface EntryPageHeaderProps extends React.ComponentProps<"header"> {
  backHref?: string;
  onBackClick?: React.MouseEventHandler<HTMLAnchorElement>;
  isBookmarked?: boolean;
  onBookmarkClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export { EntryPageHeader } from "./EntryPageHeader";
