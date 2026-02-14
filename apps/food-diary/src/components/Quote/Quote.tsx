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
      variant="body"
      size="xl"
      data-component-type="Quote"
      id={id}
      className={cn("font-display italic text-center", className)}
      {...props}
    >
      <span aria-hidden="true">"</span>
      {children}
      <span aria-hidden="true">"</span>
    </Typography>
  );
}
