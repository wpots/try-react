import type { ReactNode } from "react";

interface SplashPanelProps {
  title: string;
  cta: ReactNode;
  tone: "primary" | "zen";
  children: ReactNode;
}

export function SplashPanel({
  title,
  cta,
  tone,
  children,
}: SplashPanelProps): React.JSX.Element {
  const toneClasses =
    tone === "primary"
      ? "bg-gradient-to-br from-ds-surface-primary-start to-ds-surface-primary-end"
      : "bg-gradient-to-br from-ds-surface-zen-start to-ds-surface-zen-end";

  return (
    <article
      className={
        "flex min-h-80 flex-col overflow-hidden rounded-md shadow-lg " +
        toneClasses
      }
    >
      <h2 className="px-4 pt-4 text-center text-2xl font-semibold text-ds-surface/60">
        {title}
      </h2>
      <div className="grid min-h-44 grow place-items-end px-3 py-3 sm:place-items-center">
        {cta}
      </div>
      <ul className="m-0 list-none bg-ds-surface p-0">{children}</ul>
    </article>
  );
}
