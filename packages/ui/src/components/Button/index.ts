import type React from "react";

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "default" | "outline" | "secondary" | "destructive" | "link" | "strong";
  size?: "default" | "lg" | "icon" | "link";
};

export { Button } from "./Button";
