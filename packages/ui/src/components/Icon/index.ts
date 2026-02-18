import type React from "react";

export type IconName = keyof typeof import("lucide-react").icons;

export interface IconProps extends Omit<React.ComponentProps<"svg">, "name"> {
  name: IconName;
}

export { Icon } from "./Icon";
