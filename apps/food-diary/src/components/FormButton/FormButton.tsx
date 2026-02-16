import { Button, cn } from "@repo/ui";

type ButtonVariant = NonNullable<React.ComponentProps<typeof Button>["variant"]>;
type ButtonSize = NonNullable<React.ComponentProps<typeof Button>["size"]>;

const variantMap = {
  default: "default",
  iconOnly: "outline",
  link: "link",
  outline: "outline",
} satisfies Record<FormButtonVariant, ButtonVariant>;

const sizeMap = {
  default: "sm",
  iconOnly: "icon",
  link: "link",
  outline: "sm",
} satisfies Record<FormButtonVariant, ButtonSize>;

export interface FormButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size" | "variant"> {
  variant?: FormButtonVariant;
}

export type FormButtonVariant = "default" | "outline" | "link" | "iconOnly";

export function FormButton({
  className,
  variant = "default",
  ...props
}: FormButtonProps): React.JSX.Element {
  const isIconOnly = variant === "iconOnly";

  return (
    <Button
      className={cn(
        isIconOnly && "h-8 w-8 rounded-ds-full text-ds-on-surface-secondary",
        className,
      )}
      size={sizeMap[variant]}
      variant={variantMap[variant]}
      {...props}
    />
  );
}
