import { defaultLocale, locales, type AppLocale } from "@/i18n/config";

export function toAppLocale(locale: string): AppLocale {
  const matchedLocale = locales.find((option) => option === locale);
  return matchedLocale ?? defaultLocale;
}

export function isLocale(
  value: string,
  options: readonly AppLocale[],
): value is AppLocale {
  return options.some((option) => option === value);
}
