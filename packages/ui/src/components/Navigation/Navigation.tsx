import type { NavigationProps } from "./index";

import { cn } from "../../lib/utils";

import { NavigationItem } from "./NavigationItem";

export function Navigation({
  className,
  listClassName,
  children,
  ...props
}: NavigationProps): React.JSX.Element {
  return (
    <nav className={cn("w-full", className)} {...props}>
      <ul className={cn("flex items-center gap-ds-l", listClassName)}>
        {children}
      </ul>
    </nav>
  );
}

Navigation.Item = NavigationItem;
