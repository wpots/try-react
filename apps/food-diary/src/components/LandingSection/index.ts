export interface LandingSectionProps extends React.ComponentProps<"section"> {
  variant?: "default" | "callout" | "muted";
  maxWidth?: "full" | "narrow";
}

export interface FeatureCardProps extends React.ComponentProps<"article"> {
  icon: string;
  title: string;
  description: string;
}

export { LandingSection } from "./LandingSection";
export { FeatureCard } from "./FeatureCard";
