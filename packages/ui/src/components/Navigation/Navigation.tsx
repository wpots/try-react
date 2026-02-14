import type { NavigationProps } from "./index";

import { NavigationItem } from "./NavigationItem";

export function Navigation({ className, children, ...props }: NavigationProps): React.JSX.Element {
  return (
    <nav className={className} {...props}>
      <ul className="flex items-center gap-ds-xl">{children}</ul>
    </nav>
  );
}

Navigation.Item = NavigationItem;
