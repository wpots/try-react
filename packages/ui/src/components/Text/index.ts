import type React from "react";

export type TextProps = React.ComponentProps<"p"> & {
  tone?: "default" | "danger";
};

export { Text } from "./Text";
