import { Link } from "../Link/Link";
import type { NavigationItemProps } from "./index";

export function NavigationItem({ href, className, id, children, ...props }: NavigationItemProps): React.JSX.Element {
  return (
    <li>
      <Link href={href} className={className} {...props} variant="link" size="link">
        {children}
      </Link>
    </li>
  );
}
