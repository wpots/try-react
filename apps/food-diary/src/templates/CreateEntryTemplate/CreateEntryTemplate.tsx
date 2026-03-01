"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { EntryForm, type EntryFormMode } from "@/components/EntryForm";
import { PageHeader } from "@/components/PageHeader";

interface CreateEntryTemplateProps {
  entryId?: string;
  initialMode?: EntryFormMode;
}

export function CreateEntryTemplate({ entryId, initialMode = "chat" }: CreateEntryTemplateProps): React.JSX.Element {
  const tEntry = useTranslations("entry");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBackClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleBookmarkClick = useCallback(() => {
    setIsBookmarked(previousState => !previousState);
  }, []);

  return (
    <main id="main-content" className="flex h-dvh flex-col">
      <PageHeader isBookmarked={isBookmarked} onBackClick={handleBackClick} onBookmarkClick={handleBookmarkClick} />
      <EntryForm
        entryId={entryId}
        initialMode={initialMode}
        isBookmarked={isBookmarked}
        onBookmarkChange={setIsBookmarked}
        onDirtyChange={setHasUnsavedChanges}
      />
    </main>
  );
}
