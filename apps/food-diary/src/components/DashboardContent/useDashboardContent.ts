import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";

export interface UseDashboardContentResult {
  addEntryLabel: string;
  authRequiredText: string;
  isLoading: boolean;
  isUnauthenticated: boolean;
  onAddEntry: () => void;
  title: string;
}

export function useDashboardContent(): UseDashboardContentResult {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { loading, user } = useAuth();

  const handleAddEntry = (): void => {
    router.push("/entry/create");
  };

  return {
    addEntryLabel: t("addEntry"),
    authRequiredText: t("authRequired"),
    isLoading: loading,
    isUnauthenticated: !user,
    onAddEntry: handleAddEntry,
    title: t("title"),
  };
}
