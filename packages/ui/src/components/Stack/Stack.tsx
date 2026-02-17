import type { StackProps, StackGap } from "./index";
import { cn } from "../../lib/utils";

const gapClassNames: Record<StackGap, string> = {
  xs: "gap-ds-xs",
  s: "gap-ds-s",
  m: "gap-ds-m",
  l: "gap-ds-l",
  xl: "gap-ds-xl",
};

const alignClassNames: Record<
  NonNullable<StackProps["align"]>,
  string
> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClassNames: Record<NonNullable<StackProps["justify"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

function getResponsiveGapClassNames(prefix: string, gap?: StackGap): string {
  if (!gap) {
    return "";
  }

  return `${prefix}:${gapClassNames[gap]}`;
}

export function Stack({
  as: Component = "div",
  direction = "column",
  align = "stretch",
  justify = "start",
  wrap = false,
  gap = "m",
  gapSm,
  gapMd,
  gapLg,
  gapXl,
  className,
  ...props
}: StackProps): React.JSX.Element {
  return (
    <Component
      {...props}
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        alignClassNames[align],
        justifyClassNames[justify],
        wrap && "flex-wrap",
        gapClassNames[gap],
        getResponsiveGapClassNames("sm", gapSm),
        getResponsiveGapClassNames("md", gapMd),
        getResponsiveGapClassNames("lg", gapLg),
        getResponsiveGapClassNames("xl", gapXl),
        className,
      )}
    />
  );
}
