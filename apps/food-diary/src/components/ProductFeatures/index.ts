export interface ProductFeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface ProductFeaturesProps extends React.ComponentProps<"section"> {
  /** Optional label above the heading (e.g. "The Real You") */
  eyebrow?: string;
  heading: string;
  description: string;
  items: ProductFeatureItem[];
}

export { ProductFeatures } from "./ProductFeatures";
