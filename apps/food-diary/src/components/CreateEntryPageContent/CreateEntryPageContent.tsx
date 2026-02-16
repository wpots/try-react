"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

import { EntryForm } from "@/components/EntryForm";
import { EntryPageHeader } from "@/components/EntryPageHeader";

export function CreateEntryPageContent(): React.JSX.Element {
  const tEntry = useTranslations("entry");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleBackClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!hasUnsavedChanges) {
        return;
      }

      const shouldLeave = window.confirm(tEntry("leavePrompt.message"));
      if (!shouldLeave) {
        event.preventDefault();
      }
    },
    [hasUnsavedChanges, tEntry],
  );

  return (
    <div className="flex h-dvh flex-col">
      <EntryPageHeader onBackClick={handleBackClick} />
      <div className="min-h-0 flex-1">
        <EntryForm onDirtyChange={setHasUnsavedChanges} />
      </div>
    </div>
  );
}
