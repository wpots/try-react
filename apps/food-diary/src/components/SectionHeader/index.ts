/**
 * Eyebrow slot: pass a Label or IconTile (or any element) to show above the heading.
 */
export interface SectionHeaderProps extends React.ComponentProps<"div"> {
  /** Optional element above the heading (e.g. <Label>...</Label> or <IconTile icon={...} />). */
  eyebrow?: React.ReactNode;
  heading: string;
  description: string;
}

export { SectionHeader } from "./SectionHeader";
