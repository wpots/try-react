"use client";

import { Switch as AriaSwitch } from "react-aria-components";

import type { SwitchProps } from "./index.ts";
import { cn } from "../../lib/utils.ts";

export function Switch({
  className,
  children,
  ...props
}: SwitchProps): React.JSX.Element {
  return (
    <AriaSwitch
      {...props}
      className={cn(
        "inline-flex cursor-default items-center gap-ds-s text-ds-on-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-surface",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "[&_[data-slot=track]]:h-6 [&_[data-slot=track]]:w-11 [&_[data-slot=track]]:rounded-ds-full [&_[data-slot=track]]:bg-ds-surface-muted [&_[data-slot=track]]:transition-colors",
        "[&_[data-slot=track][data-selected]]:bg-ds-surface-primary",
        "[&_[data-slot=thumb]]:h-5 [&_[data-slot=thumb]]:w-5 [&_[data-slot=thumb]]:translate-x-0.5 [&_[data-slot=thumb]]:rounded-ds-full [&_[data-slot=thumb]]:bg-ds-on-surface [&_[data-slot=thumb]]:transition-transform [&_[data-slot=thumb]]:ring-0",
        "[&_[data-slot=track][data-selected]_[data-slot=thumb]]:translate-x-5",
        className,
      )}
    >
      {children}
    </AriaSwitch>
  );
}
