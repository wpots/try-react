import type React from "react";
import { FormLabel } from "@repo/ui";

export interface FormSectionProps {
  label: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
}

export function FormSection({ label, children, required, optional, hint }: FormSectionProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-ds-xs">
      <FormLabel className="flex items-center gap-ds-xs font-semibold text-ds-on-surface">
        {label}
        {required ? <span className="text-ds-danger">*</span> : null}
        {optional ? <span className="font-normal text-ds-on-surface-secondary">(optioneel)</span> : null}
      </FormLabel>

      {hint ? <p className="text-sm text-ds-on-surface-secondary">{hint}</p> : null}
      {children}
    </div>
  );
}
