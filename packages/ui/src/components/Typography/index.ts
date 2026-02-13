export type BodySize = "xs" | "sm" | "base" | "lg" | "xl" | "xxl";
export type HeadingSize = "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl";
export type BodyTag = "p" | "span" | "small";
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Responsive size configuration
 */
export type ResponsiveSize<T> =
  | T
  | {
      base?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
      "2xl"?: T;
    };

/**
 * Props for body text variant
 */
type BodyProps = React.ComponentProps<"p"> & {
  variant: "body";
  size?: ResponsiveSize<BodySize>;
  tag?: BodyTag;
};

/**
 * Props for heading variant
 */
type HeadingProps = React.ComponentProps<"h1"> & {
  variant: "heading";
  size?: ResponsiveSize<HeadingSize>;
  tag?: HeadingTag;
};

export type TypographyProps = BodyProps | HeadingProps;

/**
 * Valid inline elements that can be nested inside Typography
 */
export const VALID_INLINE_CHILDREN = [
  "span",
  "a",
  "strong",
  "em",
  "code",
  "abbr",
  "time",
  "mark",
  "small",
  "sub",
  "sup",
] as const;

export { Typography } from "./Typography";
