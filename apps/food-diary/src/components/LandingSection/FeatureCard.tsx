import classnames from "@/utils/classnames/classnames";
import type { FeatureCardProps } from "./index";

export function FeatureCard({
  icon,
  title,
  description,
  className,
  ...props
}: FeatureCardProps): React.JSX.Element {
  return (
    <article
      className={classnames("flex flex-col items-center text-center", className)}
      {...props}
    >
      <div className="mb-4 flex h-24 w-24 items-center justify-center">
        <img src={icon} alt="" className="h-full w-full" />
      </div>
      <h3 className="mb-4 text-2xl font-bold text-ds-on-surface-strong">
        {title}
      </h3>
      <p className="text-lg leading-relaxed text-ds-on-surface">{description}</p>
    </article>
  );
}
