"use client";

import { isValidElement, useMemo } from "react";

import type { ResponsiveSize, TypographyProps } from "./index";

import { cn } from "../../lib/utils";

const TYPOGRAPHY_CLASSES: Record<string, Record<string, string>> = {
  body: {
    xs: "font-ds-body-xs",
    sm: "font-ds-body-sm",
    base: "font-ds-body-base",
    lg: "font-ds-body-lg",
    xl: "font-ds-body-xl",
    xxl: "font-ds-body-xxl",
  },
  heading: {
    xxs: "font-ds-heading-xxs",
    xs: "font-ds-heading-xs",
    sm: "font-ds-heading-sm",
    base: "font-ds-heading-base",
    md: "font-ds-heading-md",
    lg: "font-ds-heading-lg",
    xl: "font-ds-heading-xl",
    "2xl": "font-ds-heading-2xl",
  },
};

const BREAKPOINT_PREFIXES: Record<string, string> = {
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
  "2xl": "2xl:",
};

/**
 * Block-level elements that should not be nested inside headings or paragraphs
 */
const BLOCK_ELEMENTS = [
  "div",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "section",
  "article",
  "header",
  "footer",
  "main",
  "aside",
  "nav",
];

/**
 * Validates HTML nesting rules (development only)
 */
function validateNesting(parentTag: string, children: React.ReactNode, variant: "heading" | "body"): void {
  // Only validate in development to avoid production bundle bloat and performance impact
  // eslint-disable-next-line no-process-env -- NODE_ENV is a special build-time constant in Next.js
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const childNodes = Array.isArray(children) ? children : [children];

  for (const child of childNodes) {
    if (!isValidElement(child)) {
      continue;
    }

    const childType = child.type;
    const childTag = typeof childType === "string" ? childType : (childType as { displayName?: string })?.displayName;

    // Check if child is a block element
    if (childTag && BLOCK_ELEMENTS.includes(childTag)) {
      console.warn(
        `⚠️ Typography: Invalid HTML nesting detected!\n` +
          `Block element <${childTag}> should not be nested inside <${parentTag}>.\n` +
          `This creates invalid HTML and may cause accessibility issues.\n\n` +
          `Valid children for ${variant === "heading" ? "headings" : "paragraphs"}: ` +
          `<span>, <a>, <strong>, <em>, <code>, text, or inline elements.\n\n` +
          `Consider:\n` +
          `- Use <span> for inline styling\n` +
          `- Move block elements outside the Typography component\n` +
          `- Use semantic HTML structure`,
      );
    }

    // Recursive check for Typography components
    if (childType && typeof childType !== "string" && childType?.name === "Typography") {
      const childProps = child.props as TypographyProps;
      const childTag = childProps.tag || (childProps.variant === "heading" ? "h3" : "p");

      if (BLOCK_ELEMENTS.includes(childTag)) {
        console.warn(
          `⚠️ Typography: Nested Typography with block-level tag detected!\n` +
            `<${childTag}> (Typography ${childProps.variant}) nested inside <${parentTag}> (Typography ${variant}).\n` +
            `This creates invalid HTML structure.\n\n` +
            `Solution: Use tag="span" for the nested Typography component.`,
        );
      }
    }
  }
}

/**
 * Generates typography classes from responsive size configuration
 */
function getTypographyClasses<T extends string>(
  variant: "heading" | "body",
  size: ResponsiveSize<T> | undefined,
): string {
  if (!size) {
    return TYPOGRAPHY_CLASSES[variant]?.base || "";
  }

  // Simple string size
  if (typeof size === "string") {
    return TYPOGRAPHY_CLASSES[variant]?.[size] || "";
  }

  // Responsive size object
  const classes: string[] = [];

  // Base size (no prefix)
  if (size.base) {
    classes.push(TYPOGRAPHY_CLASSES[variant]?.[size.base] || "");
  }

  // Responsive sizes with breakpoint prefixes
  (Object.keys(BREAKPOINT_PREFIXES) as (keyof typeof BREAKPOINT_PREFIXES)[]).forEach(breakpoint => {
    const breakpointSize = size[breakpoint as keyof typeof size];
    if (breakpointSize && typeof breakpointSize === "string") {
      const baseClass = TYPOGRAPHY_CLASSES[variant]?.[breakpointSize];
      if (baseClass) {
        // Extract font size and line height classes and add breakpoint prefix
        const prefix = BREAKPOINT_PREFIXES[breakpoint];
        const parts = baseClass.split(" ");
        const responsiveClasses = parts.map(part => `${prefix}${part}`);
        classes.push(...responsiveClasses);
      }
    }
  });

  return classes.join(" ");
}

export function Typography({ tag, variant, size = "base", className, children, ...props }: TypographyProps) {
  const Component = tag || (variant === "heading" ? "h3" : "p");

  const typographyClass = getTypographyClasses(variant, size);

  const classes = cn(typographyClass, className);

  // Only validate when children change
  useMemo(() => {
    // eslint-disable-next-line no-process-env -- NODE_ENV is a special build-time constant in Next.js
    if (process.env.NODE_ENV !== "production") {
      validateNesting(Component, children, variant);
    }
  }, [children, Component, variant]);

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
