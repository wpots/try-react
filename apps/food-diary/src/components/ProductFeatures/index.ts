export interface ProductFeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface ProductFeaturesProps extends React.ComponentProps<"section"> {
  /** Optional element above the heading (e.g. <Label>...</Label> or <IconTile icon={...} />). */
  eyebrow?: React.ReactNode;
  heading: string;
  description: string;
  items: ProductFeatureItem[];
}

export { ProductFeatures } from "./ProductFeatures";
