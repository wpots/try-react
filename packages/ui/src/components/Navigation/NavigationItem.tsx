import { Typography } from "../Typography/Typography";
import type { NavigationItemProps } from "./index";

import { cn } from "../../lib/utils";

export function NavigationItem({
  href,
  className,
  id,
  children,
  ...props
}: NavigationItemProps): React.JSX.Element {
  return (
    <li>
      <a
        href={href}
        id={id}
        className={cn(
          "text-ds-on-surface-strong transition-colors hover:text-ds-primary",
          className,
        )}
        {...props}
      >
        <Typography tag="span" variant="body" size="base">
          {children}
        </Typography>
      </a>
    </li>
  );
}
