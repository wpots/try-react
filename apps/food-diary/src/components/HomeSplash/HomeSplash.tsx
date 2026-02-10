"use client";

import { Link } from "@/i18n/navigation";
import { HomeSplashView } from "./HomeSplashView";
import { useHomeSplash } from "./useHomeSplash";

export function HomeSplash(): React.JSX.Element {
  const { footerLinkLabel, ...viewProps } = useHomeSplash();

  return (
    <HomeSplashView
      {...viewProps}
      footerLink={
        <Link className="text-foreground-muted underline" href="/auth/login">
          {footerLinkLabel}
        </Link>
      }
    />
  );
}
