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
        "bg-gradient-to-br from-ds-brand-primary-soft to-ds-brand-primary",
        className
      )}
      {...props}
    >
      {backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          role="presentation"
        />
      ) : null}

      <div className="relative z-10 px-6 py-32 text-center md:py-40">
        <p className="m-0 text-5xl font-light leading-tight text-ds-surface md:text-6xl lg:text-7xl">
          De <strong className="font-bold">{title}</strong>
          <br />
          <span className="block mt-2">{subtitle}</span>
        </p>
      </div>
    </header>
  );
}
