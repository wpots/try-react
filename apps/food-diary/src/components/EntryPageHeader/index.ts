export interface EntryPageHeaderProps extends React.ComponentProps<"header"> {
  backHref?: string;
  onBackClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export { EntryPageHeader } from "./EntryPageHeader";
