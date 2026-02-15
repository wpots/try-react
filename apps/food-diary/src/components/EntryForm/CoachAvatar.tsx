import { AnimatedLogo, cn } from "@repo/ui";

export interface CoachAvatarProps {
  size?: "sm" | "md";
}

export function CoachAvatar({ size = "sm" }: CoachAvatarProps): React.JSX.Element {
  const dimensions = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <div
      className={cn(
        dimensions,
        "flex shrink-0 items-center justify-center overflow-hidden rounded-ds-full bg-gradient-to-br from-ds-surface-primary/30 to-ds-brand-support",
      )}
      aria-hidden="true"
    >
      <AnimatedLogo className="size-full" variant="strong" />
    </div>
  );
}
