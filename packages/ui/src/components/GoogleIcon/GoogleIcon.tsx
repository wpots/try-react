import type { GoogleIconProps } from "./index";

/**
 * Brand Google "G" icon.
 */
export function GoogleIcon({
  className,
  ...rest
}: GoogleIconProps): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M43.61 20.08H42V20H24v8h11.3A12 12 0 0 1 24 36a12 12 0 1 1 8-20.96l5.66-5.66A19.92 19.92 0 0 0 24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92Z"
        fill="#FFC107"
      />
      <path
        d="m6.3 14.69 6.57 4.82A12 12 0 0 1 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66A19.92 19.92 0 0 0 24 4a20 20 0 0 0-17.7 10.69Z"
        fill="#FF3D00"
      />
      <path
        d="M24 44c5.17 0 9.86-1.98 13.41-5.2l-6.2-5.23A11.95 11.95 0 0 1 24 36a12 12 0 0 1-11.28-7.95L6.2 33.08A20 20 0 0 0 24 44Z"
        fill="#4CAF50"
      />
      <path
        d="M43.61 20.08H42V20H24v8h11.3a12.1 12.1 0 0 1-6.18 7.7l6.2 5.24C34.88 41.24 44 34.5 44 24c0-1.34-.14-2.65-.39-3.92Z"
        fill="#1976D2"
      />
    </svg>
  );
}
