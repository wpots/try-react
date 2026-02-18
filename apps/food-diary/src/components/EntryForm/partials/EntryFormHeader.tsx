import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";


import { ProgressDots } from "./ProgressDots";

interface EntryFormHeaderProps {
  mode: "chat" | "form";
  currentStepIndex: number;
  totalSteps: number;
  onSwitchMode: () => void;
}

export function EntryFormHeader({
  mode,
  currentStepIndex,
  totalSteps,
  onSwitchMode,
}: EntryFormHeaderProps): React.JSX.Element {
  const t = useTranslations("entry");
  const switchLabel =
    mode === "chat" ? t("form.switchToForm") : t("form.switchToChat");

  return (
    <div className="flex items-center justify-between border-b border-ds-border-subtle bg-ds-surface/80 px-ds-l py-ds-m">
      <ProgressDots total={totalSteps} currentIndex={currentStepIndex} />
      <Button variant="link" size="link" onClick={onSwitchMode} className="font-ds-label-sm">
        {switchLabel}
      </Button>
    </div>
  );
}
