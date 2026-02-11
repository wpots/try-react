import classnames from "@/utils/classnames/classnames";
import type { LandingSectionProps } from "./index";

export function LandingSection({
  variant = "default",
  maxWidth = "narrow",
  className,
  children,
  ...props
}: LandingSectionProps): React.JSX.Element {
  const variantClasses = {
    default: "",
    callout: "bg-surface-muted/20 rounded-lg",
    muted: "bg-surface-muted/30 rounded-lg",
  };

  const widthClasses = {
    full: "max-w-6xl",
    narrow: "max-w-4xl",
  };

  return (
    <section
      className={classnames(
        "mx-auto w-full px-6 py-12",
        widthClasses[maxWidth],
        className
      )}
      {...props}
    >
      <div className={classnames("px-4 py-6", variantClasses[variant])}>
        {children}
      </div>
    </section>
  );
}
