import type React from "react";

export interface LabelProps extends React.ComponentProps<"span"> {
  variant?: "default" | "pill";
}

export { Label } from "./Label";
