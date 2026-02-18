import { Activity, Crown, HandHeart, Heart, Star } from "lucide-react";

import { cn } from "../../lib/utils";

import type { IconName, IconProps } from "./index";

const ICON_COMPONENTS: Record<
  IconName,
  React.ComponentType<React.ComponentProps<"svg">>
> = {
  activity: Activity,
  crown: Crown,
  "hand-heart": HandHeart,
  heart: Heart,
  star: Star,
};

export function Icon({
  className,
  name,
  ...props
}: IconProps): React.JSX.Element {
  const LucideIcon = ICON_COMPONENTS[name];

  return <LucideIcon className={cn("h-4 w-4", className)} {...props} />;
}
