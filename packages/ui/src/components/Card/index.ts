import type React from "react";

export type CardVariant = "default" | "soft" | "strong" | "knockout";

interface CardBaseProps {
  variant?: CardVariant;
  as?: React.ElementType;
}

export type CardProps<T extends React.ElementType = "div"> =
  CardBaseProps &
  Omit<React.ComponentPropsWithoutRef<T>, keyof CardBaseProps>;

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
