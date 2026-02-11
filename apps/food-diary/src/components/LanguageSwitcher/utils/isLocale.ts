import type { AppLocale } from "@/i18n/config";

export function isLocale(
  value: string,
  options: readonly AppLocale[],
): value is AppLocale {
  return options.some((option) => option === value);
}
