import { Typography, cn } from "@repo/ui";

import type { SectionHeaderProps } from "./index.ts";

export function SectionHeader({
  eyebrow,
  heading,
  description,
  headingVariant = "default",
  headingTag = "h2",
  children,
  className,
  ...props
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn("flex flex-col gap-ds-xl max-w-2xl mx-auto", className)}
      data-component-type="SectionHeader"
      {...props}
    >
      {eyebrow}
      <Typography
        tag={headingTag}
        variant="heading"
        size={{ base: "lg", md: "xl" }}
        className={cn("text-center", headingVariant === "script" ? "font-ds-script-xl" : "")}
      >
        {heading}
      </Typography>
      {description ? (
        <Typography
          tag="p"
          variant="body"
          size={{ base: "base", md: "lg" }}
          className="mt-ds-s text-ds-on-surface-muted [&>span+span]:mt-ds-s"
        >
          {description.split("\n").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </Typography>
      ) : null}
      {children}
    </div>
  );
}
