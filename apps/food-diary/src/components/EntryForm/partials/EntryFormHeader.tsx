import { Button } from "@repo/ui";

import { ProgressDots } from "../ProgressDots";
import { getCmsText } from "../utils/cms";

interface EntryFormHeaderProps {
  cms: Record<string, unknown>;
  mode: "chat" | "form";
  currentStepIndex: number;
  totalSteps: number;
  onSwitchMode: () => void;
}

export function EntryFormHeader({
  cms,
  mode,
  currentStepIndex,
  totalSteps,
  onSwitchMode,
}: EntryFormHeaderProps): React.JSX.Element {
  const switchLabel =
    mode === "chat"
      ? getCmsText(cms, "form.switchToForm")
      : getCmsText(cms, "form.switchToChat");

  return (
    <div className="flex items-center justify-between border-b border-ds-border-subtle bg-ds-surface/80 px-ds-l py-ds-m">
      <ProgressDots total={totalSteps} currentIndex={currentStepIndex} />
      <Button
        variant="link"
        size="link"
        onClick={onSwitchMode}
        className="font-ds-label-sm"
      >
        {switchLabel}
      </Button>
    </div>
  );
}
