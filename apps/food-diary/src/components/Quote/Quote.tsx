import { Typography, cn } from "@repo/ui";

import type { QuoteProps } from "./index";

export function Quote({
  className,
  id = "quote",
  children,
  ...props
}: QuoteProps): React.JSX.Element {
  return (
    <Typography
      tag="p"
      variant="display"
      size="xl"
      data-component-type="Quote"
      id={id}
      className={cn("italic text-center", className)}
      {...props}
    >
      <span aria-hidden="true">&ldquo;</span>
      {children}
      <span aria-hidden="true">&rdquo;</span>
    </Typography>
  );
}
