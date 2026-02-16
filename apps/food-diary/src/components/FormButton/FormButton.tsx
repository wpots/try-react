import { Button, cn } from "@repo/ui";

type ButtonVariant = NonNullable<React.ComponentProps<typeof Button>["variant"]>;
type ButtonSize = NonNullable<React.ComponentProps<typeof Button>["size"]>;
type SharedFormButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "size" | "variant"
>;

type FormButtonRegularVariant = "default" | "outline" | "link";
type FormButtonIconVariant = "default" | "accent";

interface FormButtonRegularProps extends SharedFormButtonProps {
  iconOnly?: false;
  variant?: FormButtonRegularVariant;
}

interface FormButtonIconOnlyProps extends SharedFormButtonProps {
  iconOnly: true;
  variant?: FormButtonIconVariant;
}

export type FormButtonVariant =
  | FormButtonRegularVariant
  | FormButtonIconVariant;
export type FormButtonProps = FormButtonRegularProps | FormButtonIconOnlyProps;

function getButtonVariant(
  isIconOnly: boolean,
  variant: FormButtonVariant,
): ButtonVariant {
  if (isIconOnly) {
    return "outline";
  }

  if (variant === "link" || variant === "outline") {
    return variant;
  }

  return "default";
}

function getButtonSize(
  isIconOnly: boolean,
  variant: FormButtonVariant,
): ButtonSize {
  if (isIconOnly) {
    return "icon";
  }

  if (variant === "link") {
    return "link";
  }

  return "sm";
}

export function FormButton({
  className,
  iconOnly = false,
  variant = "default",
  ...props
}: FormButtonProps): React.JSX.Element {
  const iconVariantClasses =
    iconOnly && variant === "accent"
      ? "hover:border-ds-brand-zen hover:bg-ds-brand-zen/20"
      : iconOnly && "hover:border-ds-brand-primary hover:bg-ds-brand-primary-soft";

  return (
    <Button
      className={cn(
        iconOnly && "h-8 w-8 rounded-ds-full text-ds-on-surface-secondary",
        iconVariantClasses,
        className,
      )}
      size={getButtonSize(iconOnly, variant)}
      variant={getButtonVariant(iconOnly, variant)}
      {...props}
    />
  );
}
