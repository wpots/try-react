export interface ProductFeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface ProductFeaturesProps extends React.ComponentProps<"section"> {
  heading: string;
  items: ProductFeatureItem[];
}

export { ProductFeatures } from "./ProductFeatures";
