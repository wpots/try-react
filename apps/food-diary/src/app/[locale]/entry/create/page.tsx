import { useTranslations } from "next-intl";
import EntryForm from "@/components/EntryForm";

const CreateEntryPage = () => {
  const t = useTranslations("createEntry");

  return (
    <div>
      <h1>{t("title")}</h1>
      <EntryForm />
    </div>
  );
};

export default CreateEntryPage;
