import type React from "react";

export interface NextImageLikeProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  style?: React.CSSProperties;
}

export interface ImageProps extends React.ComponentProps<"img"> {
  nextImageComponent?: React.ComponentType<NextImageLikeProps>;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export { Image } from "./Image";
