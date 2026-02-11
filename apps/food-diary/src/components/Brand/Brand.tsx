import { Typography } from "@repo/ui";

import type { BrandProps } from "./index";

import { Logo } from "@/components/Logo";
import classnames from "@/utils/classnames/classnames";

export function Brand({
  quote,
  tagline,
  className,
  id = "brand",
  ...props
}: BrandProps): React.JSX.Element {
  return (
    <div
      data-component-type="Brand"
      id={id}
      className={classnames("flex flex-col items-start gap-ds-s", className)}
      {...props}
    >
      <Logo
        id="brand-logo"
        href="#home"
        size="lg"
        className="text-ds-on-primary"
      />
      <Typography variant="body" size="sm" className="text-ds-on-primary">
        {quote}
      </Typography>
      <span
        aria-hidden
        className="block h-px w-full max-w-40 bg-ds-on-primary/60"
      />
      <Typography
        tag="h3"
        variant="heading"
        size="sm"
        className="text-ds-on-primary"
      >
        {tagline}
      </Typography>
    </div>
  );
}
