import { icons } from "lucide-react";

import { cn } from "../../lib/utils";

import type { IconProps } from "./index";

export function Icon({
  className,
  name,
  ...props
}: IconProps): React.JSX.Element {
  const LucideIcon = icons[name];

  return <LucideIcon className={cn("h-4 w-4", className)} {...props} />;
}
