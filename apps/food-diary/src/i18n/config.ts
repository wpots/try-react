export const locales = ["nl", "en"] as const;
export const defaultLocale = "nl";

export type AppLocale = (typeof locales)[number];
