import type React from "react";

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "solid" | "outline";
};

export { Button } from "./Button";
