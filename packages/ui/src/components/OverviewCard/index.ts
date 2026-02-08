import type { ReactNode } from "react";

export interface OverviewCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export { OverviewCard } from "./OverviewCard";
