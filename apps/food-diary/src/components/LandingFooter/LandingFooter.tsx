import classnames from "@/utils/classnames/classnames";
import type { LandingFooterProps } from "./index";

export function LandingFooter({
  appName = "The Real You",
  quote = "Success is not final, failure is not fatal. It's the courage to continue that counts.",
  tagline = "The Real You",
  description = "The Real You is ontstaan toen ik bezig was met mijn eigen herstel. Het was en is vallen en opstaan en vooral blijven proberen en kijken wat werkt voor jou. Als je inziet dat jouw eetprobleem niet iets is wat je bent, maar iets is wat je hebt en dus ook afstand van kunt nemen, onstaat er ruimte je echte zelf te vinden.",
  copyright = "Copyright 2019 Petticode",
  className,
  ...props
}: LandingFooterProps): React.JSX.Element {
  return (
    <footer
      className={classnames(
        "bg-gradient-to-br from-ds-brand-primary-strong to-ds-brand-ink",
        "px-6 py-16 text-ds-surface",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2">
          <aside className="text-base leading-relaxed opacity-90">
            {description}
          </aside>

          <div className="flex flex-col items-center text-center">
            <img
              src="/img/icons/favicon-96x96.png"
              alt={appName}
              className="mb-4 h-24 w-24 brightness-0 invert"
            />
            <h2 className="mb-2 font-display text-3xl font-normal">Try</h2>
            <p className="mb-4 text-sm leading-relaxed opacity-90">{quote}</p>
            <h5 className="text-base font-semibold">{tagline}</h5>
          </div>
        </div>

        <small className="mt-12 block text-center text-xs opacity-75">
          {copyright}
        </small>
      </div>
    </footer>
  );
}
