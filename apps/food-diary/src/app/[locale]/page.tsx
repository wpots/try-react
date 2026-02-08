import { useTranslations } from "next-intl";
import { Button } from "@repo/ui";
import EntryOverview from "@/components/EntryOverview";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const HomePage = () => {
  const t = useTranslations("home");
  const common = useTranslations("common");

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <LanguageSwitcher />
      </div>
      <h1>{t("welcome", { appName: common("appName") })}</h1>
      <Button type="button">{t("sharedButton")}</Button>
      <EntryOverview />
    </div>
  );
};

export default HomePage;
