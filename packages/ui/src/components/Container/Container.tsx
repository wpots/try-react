import type { ContainerProps } from "./index";

import { cn } from "../../lib/utils";

const SIZE_CLASSNAMES: Record<NonNullable<ContainerProps["size"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-full",
};

export function Container({
  children,
  size = "default",
  noPadding = false,
  as: Component = "div",
  className,
  ...props
}: ContainerProps): React.JSX.Element {
  return (
    <Component
      className={cn("@container mx-auto w-full", !noPadding && "px-ds-l md:px-ds-xl", SIZE_CLASSNAMES[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
