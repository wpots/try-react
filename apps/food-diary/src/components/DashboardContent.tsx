"use client";

import { useTranslations } from "next-intl";
import { Button } from "@repo/ui";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import EntryOverview from "@/components/EntryOverview";
import { AuthButtons } from "@/components/AuthButtons";

export function DashboardContent(): React.JSX.Element {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { loading, user } = useAuth();

  if (loading) {
    return <p>{t("loading")}</p>;
  }

  if (!user) {
    return (
      <section className="grid gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="leading-7">{t("authRequired")}</p>
        <AuthButtons redirectPath="/dashboard" />
      </section>
    );
  }

  const handleAddEntry = () => {
    router.push("/entry/create");
  };

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <Button type="button" onClick={handleAddEntry}>
          {t("addEntry")}
        </Button>
      </div>
      <EntryOverview />
    </section>
  );
}
