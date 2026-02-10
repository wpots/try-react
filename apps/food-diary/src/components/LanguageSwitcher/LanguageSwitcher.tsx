"use client";

import { LanguageSwitcherView } from "./LanguageSwitcherView";
import { useLanguageSwitcher } from "./useLanguageSwitcher";

export default function LanguageSwitcher(): React.JSX.Element {
  const { isPending, label, locale, handleLocaleChange } =
    useLanguageSwitcher();

  return (
    <LanguageSwitcherView
      ariaLabel={label}
      disabled={isPending}
      label={label}
      locale={locale}
      onLocaleChange={handleLocaleChange}
    />
  );
}
