"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type AppLocale, locales } from "@/i18n/config";

const LanguageSwitcher = () => {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextLocale: AppLocale) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>{t("language")}</span>
      <select
        value={locale}
        onChange={event => handleChange(event.target.value as AppLocale)}
        disabled={isPending}
        aria-label={t("language")}
      >
        {locales.map(optionLocale => (
          <option key={optionLocale} value={optionLocale}>
            {optionLocale === "nl" ? "Nederlands" : "English"}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitcher;
