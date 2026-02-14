import type { LinkProps } from "../Link";
export interface NavigationItemProps extends LinkProps {
  /** Optional id for the anchor (e.g. for analytics or deep linking). */
  id?: string;
}

export interface NavigationProps extends React.ComponentProps<"nav"> {}

export { Navigation } from "./Navigation";
export { NavigationItem } from "./NavigationItem";
