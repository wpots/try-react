import classnames from "@/utils/classnames/classnames";
import type { LandingHeroProps } from "./index";

export function LandingHero({
  title = "eetdagboek app",
  subtitle = "die jou op weg helpt naar een gezonde relatie met eten.",
  backgroundImage,
  className,
  ...props
}: LandingHeroProps): React.JSX.Element {
  return (
    <header
      id="home"
      className={classnames(
        "relative flex min-h-[60vh] items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-brand-primary-soft to-brand-primary",
        className
      )}
      {...props}
    >
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          role="presentation"
        />
      ) : null}

      <div className="relative z-10 px-6 py-24 text-center">
        <p className="m-0 text-4xl leading-relaxed text-surface md:text-5xl">
          De <strong className="font-bold">{title}</strong>
          <br />
          {subtitle}
        </p>
      </div>
    </header>
  );
}
