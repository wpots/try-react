export interface PageHeaderProps extends React.ComponentProps<"header"> {
  backHref?: string;
  backAriaLabel?: string;
  onBackClick?: React.MouseEventHandler<HTMLButtonElement>;
  isBookmarked?: boolean;
  showBookmarkButton?: boolean;
  onBookmarkClick?: (isBookmarked: boolean) => void;
}

export { PageHeader } from "./PageHeader";
