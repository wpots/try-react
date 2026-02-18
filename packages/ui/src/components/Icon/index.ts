import type React from "react";

export type IconName =
  | "activity"
  | "crown"
  | "hand-heart"
  | "heart"
  | "star";

export interface IconProps extends Omit<React.ComponentProps<"svg">, "name"> {
  name: IconName;
}

export { Icon } from "./Icon";
