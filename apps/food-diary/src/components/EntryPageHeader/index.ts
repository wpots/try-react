export interface EntryPageHeaderProps extends React.ComponentProps<"header"> {
  backHref?: string;
  onBackClick?: React.MouseEventHandler<HTMLButtonElement>;
  isBookmarked?: boolean;
  onBookmarkClick?: (isBookmarked: boolean) => void;
}

export { EntryPageHeader } from "./EntryPageHeader";
