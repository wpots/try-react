import type { NavigationItemProps } from "@repo/ui";

export interface HeaderNavProps {
  navItems: NavigationItemProps[];
  cms: (labelKey: string) => string;
}
export { HeaderNav } from "./HeaderNav";
