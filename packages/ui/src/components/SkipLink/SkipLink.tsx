import type { SkipLinkProps } from "./index";

import { cn } from "../../lib/utils";

export function SkipLink({
  href = "#main-content",
  className,
  children,
  ...props
}: SkipLinkProps): React.JSX.Element {
  return (
    <a
      href={href}
      className={cn(
        "sr-only z-50 rounded-ds-md border border-ds-border",
        "bg-ds-surface px-ds-m py-ds-s text-ds-on-surface-strong",
        "focus:not-sr-only focus:fixed focus:left-ds-m focus:top-ds-m",
        "focus:outline-none focus:ring-2 focus:ring-ds-focus-ring",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
