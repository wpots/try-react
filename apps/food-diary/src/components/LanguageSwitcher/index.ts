import type { AppLocale } from "@/i18n/config";

export interface LanguageSwitcherViewProps {
  ariaLabel: string;
  label: string;
  locale: AppLocale;
  onLocaleChange: (nextLocale: AppLocale) => void;
  disabled?: boolean;
  options?: readonly AppLocale[];
}

export { default } from "./LanguageSwitcher";
export { default as LanguageSwitcher } from "./LanguageSwitcher";
export { LanguageSwitcherView } from "./LanguageSwitcherView";
