"use client";

import { Switch as AriaSwitch } from "react-aria-components";

import type { SwitchProps } from "./index";
import { cn } from "../../lib/utils";

export function Switch({ className, children, ...props }: SwitchProps): React.JSX.Element {
  return (
    <AriaSwitch
      {...props}
      className={cn(
        "group relative inline-flex h-5 w-9 shrink-0 cursor-default items-center rounded-ds-full border-0 transition-colors",
        "bg-ds-surface-muted",
        "data-[selected]:bg-ds-surface-primary/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ds-surface",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "pressed:opacity-90",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none inline-block h-5 w-5 shrink-0 rounded-ds-full bg-ds-on-surface-muted/40 shadow-sm transition-transform",
          "translate-x-0.5",
          "group-data-[selected]:bg-ds-surface-primary group-data-[selected]:translate-x-4",
        )}
      />
      {children ? <span className="ml-ds-s text-ds-on-surface">{children}</span> : null}
    </AriaSwitch>
  );
}
