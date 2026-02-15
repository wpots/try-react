import { useTranslations } from "next-intl";
import { Button } from "@repo/ui";

import { ProgressDots } from "../ProgressDots";

interface CoachChatHeaderProps {
  canGoBack: boolean;
  currentStepIndex: number;
  isTyping: boolean;
  totalSteps: number;
  onBack: () => void;
  onSwitchMode: () => void;
}

export function CoachChatHeader({
  currentStepIndex,
  totalSteps,
  onSwitchMode,
}: CoachChatHeaderProps): React.JSX.Element {
  const t = useTranslations("createEntry");

  return (
    <div className="flex items-center justify-between border-b border-ds-border-subtle bg-ds-surface/80 px-ds-l py-ds-m">
      <ProgressDots total={totalSteps} currentIndex={currentStepIndex} />
      <Button variant="link" size="link" onClick={onSwitchMode} className="font-ds-label-sm">
        {t("form.switchToForm")}
      </Button>
    </div>
  );
}
