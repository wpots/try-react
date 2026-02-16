export type BodySize = "xs" | "sm" | "base" | "lg" | "xl" | "xxl";
export type HeadingSize = "xs" | "sm" | "base" | "md" | "lg" | "xl" | "2xl";
export type ScriptSize = "base" | "xl" | "2xl";
export type DisplaySize = BodySize;
export type LabelSize = BodySize;
export type BodyTag = "p" | "span" | "small";
export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type ScriptTag = "p" | "span" | "small" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

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

/**
 * Props for script variant (decorative/handwriting font)
 */
type ScriptProps = React.ComponentProps<"p"> & {
  variant: "script";
  size?: ResponsiveSize<ScriptSize>;
  tag?: ScriptTag;
};

/**
 * Props for display variant (body scale + display/heading font, e.g. 20px = xl)
 */
type DisplayProps = React.ComponentProps<"p"> & {
  variant: "display";
  size?: ResponsiveSize<DisplaySize>;
  tag?: BodyTag;
};

/**
 * Props for label variant (body scale + uppercase + secondary text color)
 */
type LabelProps = React.ComponentProps<"p"> & {
  variant: "label";
  size?: ResponsiveSize<LabelSize>;
  tag?: BodyTag;
};

export type TypographyProps =
  | BodyProps
  | HeadingProps
  | ScriptProps
  | DisplayProps
  | LabelProps;

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
