import { useMessages } from "next-intl";

import { EntryForm } from "@/components/EntryForm";
import { getCmsNamespace } from "@/components/EntryForm/utils/cms";

function CreateEntryPage(): React.JSX.Element {
  const messages = useMessages();
  const cms = getCmsNamespace(messages, "createEntry");

  return (
    <div className="flex h-dvh flex-col">
      <EntryForm cms={cms} />
    </div>
  );
}

export default CreateEntryPage;
