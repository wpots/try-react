"use client";

import type { EntryFormProps } from "./index";
import { CoachChat } from "./CoachChat/CoachChat";
import { TraditionalForm } from "./Form/TraditionalForm";
import { EntryFormHeader } from "./partials/EntryFormHeader";
import { useCoachChatController } from "./useCoachChatController";

export function EntryForm({ onComplete }: EntryFormProps): React.JSX.Element {
  const controller = useCoachChatController({ onComplete });

  return (
    <div className="flex h-full flex-col">
      <EntryFormHeader
        currentStepIndex={controller.currentStepIndex}
        mode={controller.mode}
        totalSteps={controller.filteredSteps.length}
        onSwitchMode={() => controller.setMode(controller.mode === "chat" ? "form" : "chat")}
      />

      {controller.mode === "form" ? (
        <TraditionalForm initialEntry={controller.entry} onComplete={controller.handleTraditionalComplete} />
      ) : (
        <CoachChat controller={controller} />
      )}
    </div>
  );
}
