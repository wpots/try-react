"use client";

import { Button } from "@repo/ui";
import { AuthButtons } from "@/components/AuthButtons";
import EntryOverview from "@/components/EntryOverview";
import { useTranslations } from "next-intl";
import { useDashboardContent } from "./useDashboardContent";

export function DashboardContent(): React.JSX.Element {
  const t = useTranslations("dashboard");
  const {
    addEntryLabel,
    authRequiredText,
    isLoading,
    isUnauthenticated,
    onAddEntry,
    title,
  } = useDashboardContent();

  if (isLoading) {
    return <p>{t("loading")}</p>;
  }

  if (isUnauthenticated) {
    return (
      <section className="grid gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="leading-7">{authRequiredText}</p>
        <AuthButtons redirectPath="/dashboard" />
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Button onClick={onAddEntry} type="button">
          {addEntryLabel}
        </Button>
      </div>
      <EntryOverview />
    </section>
  );
}
