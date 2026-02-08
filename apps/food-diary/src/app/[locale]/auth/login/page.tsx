import { useTranslations } from "next-intl";
import AuthButtons from "@/components/AuthButtons";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <section className="grid gap-4">
      <div className="grid gap-1">
        <h1>{t("loginTitle")}</h1>
        <p>{t("loginSubtitle")}</p>
      </div>
      <AuthButtons redirectPath="/entry/create" />
    </section>
  );
}
