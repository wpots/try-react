"use client";

import { useMemo } from "react";

import type { TypographyProps } from "./index";

import { cn } from "../../lib/utils";
import { getTypographyClasses } from "./utils/getTypographyClasses";
import { validateNesting } from "./utils/validateNesting";

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
