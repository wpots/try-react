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
  id?: string;
  role?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

export interface ImageProps extends React.ComponentProps<"img"> {
  component?: React.ComponentType<NextImageLikeProps>;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export { Image } from "./Image";
