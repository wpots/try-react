import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import type { AppLocale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";

import { toAppLocale } from "./utils";

export interface UseLanguageSwitcherResult {
  isPending: boolean;
  label: string;
  locale: AppLocale;
  handleLocaleChange: (nextLocale: AppLocale) => void;
}

export function useLanguageSwitcher(): UseLanguageSwitcherResult {
  const t = useTranslations("common");
  const locale = toAppLocale(useLocale());
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (nextLocale: AppLocale): void => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return {
    isPending,
    label: t("language"),
    locale,
    handleLocaleChange,
  };
}
