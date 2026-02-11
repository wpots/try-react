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
    callout: "bg-ds-brand-primary-soft/10 rounded-ds-lg border border-ds-brand-primary-soft/30",
    muted: "bg-ds-surface-subtle/20 rounded-ds-lg",
  };

  const widthClasses = {
    full: "max-w-7xl",
    narrow: "max-w-5xl",
  };

  return (
    <section
      className={classnames(
        "mx-auto w-full px-6 py-16 md:py-20",
        widthClasses[maxWidth],
        className
      )}
      {...props}
    >
      <div className={classnames("px-6 py-8 md:px-8 md:py-10", variantClasses[variant])}>
        {children}
      </div>
    </section>
  );
}
