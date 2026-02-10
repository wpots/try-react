import type { ReactNode } from "react";

interface SplashPanelProps {
  title: string;
  cta: ReactNode;
  tone: "account" | "guest";
  children: ReactNode;
}

export function SplashPanel({
  title,
  cta,
  tone,
  children,
}: SplashPanelProps): React.JSX.Element {
  const toneClasses =
    tone === "account"
      ? "bg-gradient-to-br from-panel-account-start to-panel-account-end"
      : "bg-gradient-to-br from-panel-guest-start to-panel-guest-end";

  return (
    <article
      className={
        "flex min-h-80 flex-col overflow-hidden rounded-md shadow-lg " +
        toneClasses
      }
    >
      <h2 className="px-4 pt-4 text-center text-2xl font-semibold text-surface/60">
        {title}
      </h2>
      <div className="grid min-h-44 grow place-items-end px-3 py-3 sm:place-items-center">
        {cta}
      </div>
      <ul className="m-0 list-none bg-surface p-0">{children}</ul>
    </article>
  );
}
