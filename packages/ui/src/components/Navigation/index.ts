export interface NavigationItem {
  id: string;
  href: string;
  label: React.ReactNode;
}

export interface NavigationProps extends React.ComponentProps<"nav"> {
  items: NavigationItem[];
  listClassName?: string;
  itemClassName?: string;
}

export { Navigation } from "./Navigation";
