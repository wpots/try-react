/**
 * Eyebrow slot: pass a Label or IconTile (or any element) to show above the heading.
 */
export type SectionHeaderHeadingVariant = "default" | "script";
export type SectionHeaderHeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface SectionHeaderProps extends React.ComponentProps<"div"> {
  /** Optional element above the heading (e.g. <Label>...</Label> or <IconTile icon={...} />). */
  eyebrow?: React.ReactNode;
  heading: string;
  description?: string;
  headingVariant?: SectionHeaderHeadingVariant;
  headingTag?: SectionHeaderHeadingTag;
}

export { SectionHeader } from "./SectionHeader";
