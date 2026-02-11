export interface SectionProps extends React.ComponentProps<"section"> {
  variant?: "default" | "neutral" | "knockout" | "strong";
  spacing?: "none" | "default" | "bottom-space" | "merge-content";
  as?: React.ElementType;
}

export { Section } from "./Section";
