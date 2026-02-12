export interface NavigationItemProps extends React.ComponentProps<"a"> {
  /** Optional id for the anchor (e.g. for analytics or deep linking). */
  id?: string;
}

export interface NavigationProps extends React.ComponentProps<"nav"> {
  listClassName?: string;
}

export { Navigation } from "./Navigation";
export { NavigationItem } from "./NavigationItem";
