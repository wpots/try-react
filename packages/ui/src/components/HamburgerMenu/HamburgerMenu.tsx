"use client";

import { Button, MenuTrigger, Popover } from "react-aria-components";

import type { HamburgerMenuProps } from "./index";

import { cn } from "../../lib/utils";

export function HamburgerMenu({
  buttonLabel,
  className,
  panelClassName,
  buttonClassName,
  triggerContent,
  children,
  ...props
}: HamburgerMenuProps): React.JSX.Element {
  return (
    <div className={cn("relative", className)} {...props}>
      <MenuTrigger>
        <Button
          aria-label={buttonLabel}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full",
            "text-ds-text-strong transition-colors hover:opacity-80",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring",
            buttonClassName,
          )}
        >
          {triggerContent != null ? (
            <span className="flex h-5 w-5 items-center justify-center [&>svg]:size-5">{triggerContent}</span>
          ) : (
            <span className="flex h-4 w-4 flex-col justify-between" aria-hidden>
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current" />
            </span>
          )}
        </Button>
        <Popover
          placement="bottom end"
          className={cn(
            "min-w-52 rounded-ds-md border border-ds-border",
            "bg-ds-surface p-ds-s shadow-ds-md",
            "entering:animate-in entering:fade-in entering:zoom-in-95",
            "exiting:animate-out exiting:fade-out exiting:zoom-out-95",
            panelClassName,
          )}
        >
          {children}
        </Popover>
      </MenuTrigger>
    </div>
  );
}
