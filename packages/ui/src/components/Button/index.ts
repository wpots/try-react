import type React from "react";

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "default" | "outline" | "secondary" | "destructive" | "link";
  size?: "default" | "lg" | "icon";
};

export { Button } from "./Button";
