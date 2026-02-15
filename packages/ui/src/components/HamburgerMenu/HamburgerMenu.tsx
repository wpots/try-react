"use client";

import { MenuTrigger, Popover } from "react-aria-components";

import type { HamburgerMenuProps } from "./index";

import { Button } from "../Button/Button";
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
          variant="default"
          size="icon"
          className={buttonClassName}
        >
          {triggerContent != null ? (
            <span className="flex size-4 items-center justify-center">{triggerContent}</span>
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
