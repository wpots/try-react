import type React from "react";

import type { FormLabelProps } from "./index";
import { cn } from "../../lib/utils";

const formLabelBaseClasses = "text-sm font-medium text-ds-text-muted";

export function FormLabel({
  className,
  ...props
}: FormLabelProps): React.JSX.Element {
  return <label {...props} className={cn(formLabelBaseClasses, className)} />;
}
