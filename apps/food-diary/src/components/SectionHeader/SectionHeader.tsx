import { Typography } from "@repo/ui";

import type { SectionHeaderProps } from "./index.ts";

import classnames from "@/utils/classnames/classnames";

export function SectionHeader({
  eyebrow,
  heading,
  description,
  className,
  ...props
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div className={classnames("flex flex-col gap-ds-xl", className)} data-component-type="SectionHeader" {...props}>
      {eyebrow}
      <Typography tag="h2" variant="heading" size={{ base: "lg", md: "xl" }} className="text-center">
        {heading}
      </Typography>
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
    </div>
  );
}
