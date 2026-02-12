import type { ResponsiveSize } from "../index";

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

const RESPONSIVE_TYPOGRAPHY_CLASSES: Record<
  string,
  Record<string, Record<string, string>>
> = {
  body: {
    sm: {
      xs: "sm:font-ds-body-xs",
      sm: "sm:font-ds-body-sm",
      base: "sm:font-ds-body-base",
      lg: "sm:font-ds-body-lg",
      xl: "sm:font-ds-body-xl",
      xxl: "sm:font-ds-body-xxl",
    },
    md: {
      xs: "md:font-ds-body-xs",
      sm: "md:font-ds-body-sm",
      base: "md:font-ds-body-base",
      lg: "md:font-ds-body-lg",
      xl: "md:font-ds-body-xl",
      xxl: "md:font-ds-body-xxl",
    },
    lg: {
      xs: "lg:font-ds-body-xs",
      sm: "lg:font-ds-body-sm",
      base: "lg:font-ds-body-base",
      lg: "lg:font-ds-body-lg",
      xl: "lg:font-ds-body-xl",
      xxl: "lg:font-ds-body-xxl",
    },
    xl: {
      xs: "xl:font-ds-body-xs",
      sm: "xl:font-ds-body-sm",
      base: "xl:font-ds-body-base",
      lg: "xl:font-ds-body-lg",
      xl: "xl:font-ds-body-xl",
      xxl: "xl:font-ds-body-xxl",
    },
    "2xl": {
      xs: "2xl:font-ds-body-xs",
      sm: "2xl:font-ds-body-sm",
      base: "2xl:font-ds-body-base",
      lg: "2xl:font-ds-body-lg",
      xl: "2xl:font-ds-body-xl",
      xxl: "2xl:font-ds-body-xxl",
    },
  },
  heading: {
    sm: {
      xxs: "sm:font-ds-heading-xxs",
      xs: "sm:font-ds-heading-xs",
      sm: "sm:font-ds-heading-sm",
      base: "sm:font-ds-heading-base",
      md: "sm:font-ds-heading-md",
      lg: "sm:font-ds-heading-lg",
      xl: "sm:font-ds-heading-xl",
      "2xl": "sm:font-ds-heading-2xl",
    },
    md: {
      xxs: "md:font-ds-heading-xxs",
      xs: "md:font-ds-heading-xs",
      sm: "md:font-ds-heading-sm",
      base: "md:font-ds-heading-base",
      md: "md:font-ds-heading-md",
      lg: "md:font-ds-heading-lg",
      xl: "md:font-ds-heading-xl",
      "2xl": "md:font-ds-heading-2xl",
    },
    lg: {
      xxs: "lg:font-ds-heading-xxs",
      xs: "lg:font-ds-heading-xs",
      sm: "lg:font-ds-heading-sm",
      base: "lg:font-ds-heading-base",
      md: "lg:font-ds-heading-md",
      lg: "lg:font-ds-heading-lg",
      xl: "lg:font-ds-heading-xl",
      "2xl": "lg:font-ds-heading-2xl",
    },
    xl: {
      xxs: "xl:font-ds-heading-xxs",
      xs: "xl:font-ds-heading-xs",
      sm: "xl:font-ds-heading-sm",
      base: "xl:font-ds-heading-base",
      md: "xl:font-ds-heading-md",
      lg: "xl:font-ds-heading-lg",
      xl: "xl:font-ds-heading-xl",
      "2xl": "xl:font-ds-heading-2xl",
    },
    "2xl": {
      xxs: "2xl:font-ds-heading-xxs",
      xs: "2xl:font-ds-heading-xs",
      sm: "2xl:font-ds-heading-sm",
      base: "2xl:font-ds-heading-base",
      md: "2xl:font-ds-heading-md",
      lg: "2xl:font-ds-heading-lg",
      xl: "2xl:font-ds-heading-xl",
      "2xl": "2xl:font-ds-heading-2xl",
    },
  },
};

export function getTypographyClasses<T extends string>(
  variant: "heading" | "body",
  size: ResponsiveSize<T> | undefined,
): string {
  if (!size) {
    return TYPOGRAPHY_CLASSES[variant]?.base || "";
  }

  if (typeof size === "string") {
    return TYPOGRAPHY_CLASSES[variant]?.[size] || "";
  }

  const classes: string[] = [];

  if (size.base) {
    classes.push(TYPOGRAPHY_CLASSES[variant]?.[size.base] || "");
  }

  const breakpoints = ["sm", "md", "lg", "xl", "2xl"] as const;

  breakpoints.forEach((breakpoint) => {
    const breakpointSize = size[breakpoint];
    if (!breakpointSize || typeof breakpointSize !== "string") {
      return;
    }

    const responsiveClass =
      RESPONSIVE_TYPOGRAPHY_CLASSES[variant]?.[breakpoint]?.[breakpointSize];

    if (responsiveClass) {
      classes.push(responsiveClass);
    }
  });

  return classes.join(" ");
}
