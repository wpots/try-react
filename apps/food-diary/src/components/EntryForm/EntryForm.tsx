"use client";

import type { EntryFormProps } from "./index";
import { CoachChat } from "./CoachChat";
import { TraditionalForm } from "./TraditionalForm";
import { EntryFormHeader } from "./partials/EntryFormHeader";
import { useCoachChatController } from "./useCoachChatController";

export function EntryForm({ onComplete, cms }: EntryFormProps): React.JSX.Element {
  const controller = useCoachChatController({ onComplete, cms });

  return (
    <div className="flex h-full flex-col">
      <EntryFormHeader
        cms={cms}
        currentStepIndex={controller.currentStepIndex}
        mode={controller.mode}
        totalSteps={controller.filteredSteps.length}
        onSwitchMode={() => controller.setMode(controller.mode === "chat" ? "form" : "chat")}
      />

      {controller.mode === "form" ? (
        <TraditionalForm cms={cms} initialEntry={controller.entry} onComplete={controller.handleTraditionalComplete} />
      ) : (
        <CoachChat cms={cms} controller={controller} />
      )}
    </div>
  );
}
