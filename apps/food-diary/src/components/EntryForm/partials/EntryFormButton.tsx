import { Button } from "@repo/ui";

interface EntryFormButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size" | "variant"> {
  variant?: "default" | "outline" | "link";
}

export function EntryFormButton({
  variant = "default",
  ...props
}: EntryFormButtonProps): React.JSX.Element {
  return (
    <Button
      size={variant === "link" ? "link" : "sm"}
      variant={variant}
      {...props}
    />
  );
}
