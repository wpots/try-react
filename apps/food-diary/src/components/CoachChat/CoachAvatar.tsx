export interface CoachAvatarProps {
  size?: "sm" | "md";
}

export function CoachAvatar({
  size = "sm",
}: CoachAvatarProps): React.JSX.Element {
  const dimensions = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <div
      className={`${dimensions} flex shrink-0 items-center justify-center rounded-ds-full bg-gradient-to-br from-ds-surface-subtle to-ds-brand-support`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={size === "sm" ? "h-4 w-4" : "h-5 w-5"}
      >
        <path
          d="M12 3C8 3 5 6 5 10c0 3 2 5.5 4 7 1 .8 2 1.5 3 2 1-.5 2-1.2 3-2 2-1.5 4-4 4-7 0-4-3-7-7-7z"
          fill="var(--color-ds-brand-primary-strong)"
          opacity={0.8}
        />
        <path
          d="M12 8v8M12 8c-1.5 1.5-3 2-4 2M12 8c1.5 1.5 3 2 4 2"
          stroke="white"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

