type FormFieldClassVariant =
  | "container"
  | "control"
  | "controlWithRightIcon"
  | "selectTrigger"
  | "selectValue"
  | "rightIcon";

const controlClasses =
  "h-10 w-full rounded-md border border-ds-border bg-ds-surface-elevated " +
  "px-ds-m py-ds-s text-ds-on-surface transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-ds-focus-ring/20 disabled:cursor-not-allowed " +
  "disabled:opacity-50";

export function getFormFieldClasses(variant: FormFieldClassVariant): string {
  switch (variant) {
    case "container":
      return "grid w-full items-start gap-2";
    case "control":
      return controlClasses;
    case "controlWithRightIcon":
      return (
        `${controlClasses} pr-ds-xl appearance-none ` +
        "[&::-webkit-calendar-picker-indicator]:opacity-0"
      );
    case "selectTrigger":
      return (
        `${controlClasses} relative inline-flex items-center ` +
        "justify-between pr-ds-xl text-left"
      );
    case "selectValue":
      return "w-full truncate text-left";
    case "rightIcon":
      return (
        "pointer-events-none absolute right-ds-m top-1/2 size-4 " +
        "-translate-y-1/2 text-ds-on-surface-secondary"
      );
  }
}
