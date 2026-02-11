import { Typography } from "../Typography/Typography";
import type { NavigationProps } from "./index";

import { cn } from "../../lib/utils";

export function Navigation({
  items,
  className,
  listClassName,
  itemClassName,
  ...props
}: NavigationProps): React.JSX.Element {
  return (
    <nav className={cn("w-full", className)} {...props}>
      <ul className={cn("flex items-center gap-ds-l", listClassName)}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.href}
              className={cn(
                "text-ds-on-surface-strong transition-colors hover:text-ds-primary",
                itemClassName,
              )}
            >
              <Typography tag="span" variant="body" size="base">
                {item.label}
              </Typography>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
