import type React from "react";

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "default" | "solid" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
};

export { Button } from "./Button";
