import type { ReactNode } from "react";

export interface HomeSplashViewProps {
  title: string;
  appName: string;
  subtitle: string;
  accountTitle: string;
  guestTitle: string;
  accountFeatureDevice: string;
  accountFeaturePrivacy: string;
  guestFeatureLocal: string;
  guestFeatureWarning: string;
  accountCta: string;
  guestCta: string;
  footerPrefix: string;
  footerLink: ReactNode;
  onGoogleClick?: () => void;
  onGuestClick?: () => void;
  isGoogleDisabled?: boolean;
  isGuestDisabled?: boolean;
  errorMessage?: string | null;
}

export { HomeSplash } from "./HomeSplash";
export { HomeSplashView } from "./HomeSplashView";
export { FeatureItem, SplashPanel } from "./partials";
