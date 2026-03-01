import { getLocale, getTranslations } from "next-intl/server";

import { DashboardTemplate } from "@/templates/DashboardTemplate";

import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  return {
    title: `${t("title")} — ${tCommon("brand.tagline")}`,
  };
}

export default function DashboardPage(): React.JSX.Element {
  return <DashboardTemplate />;
}
