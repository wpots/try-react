import { useTranslations } from "next-intl";

import { Card } from "@repo/ui";

import { CoachChat } from "@/components/CoachChat";

function CreateEntryPage(): React.JSX.Element {
  const t = useTranslations("createEntry");

  return (
    <div className="flex h-dvh flex-col">
      <CoachChat />
    </div>
  );
}

export default CreateEntryPage;
