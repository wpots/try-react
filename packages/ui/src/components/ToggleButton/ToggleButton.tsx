"use client";

import { ToggleButton as AriaToggleButton } from "react-aria-components";

import type { ToggleButtonProps } from "./index";

export function ToggleButton({
  className,
  ...props
}: ToggleButtonProps): React.JSX.Element {
  return (
    <AriaToggleButton
      className={className}
      {...props}
    />
  );
}
