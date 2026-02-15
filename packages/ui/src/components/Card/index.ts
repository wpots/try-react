import type React from "react";

export type CardVariant = "default" | "soft" | "strong" | "knockout";

export interface CardProps extends React.ComponentProps<"div"> {
  variant?: CardVariant;
}

export interface CardHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export interface CardActionsProps extends React.ComponentProps<"div"> {
  align?: "start" | "end" | "between";
}

export { Card } from "./Card";
export { CardActions } from "./partials/CardActions";
export { CardHeader } from "./partials/CardHeader";
