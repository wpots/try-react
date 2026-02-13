import { useTranslations } from "next-intl";

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
  canGoBack,
  currentStepIndex,
  isTyping,
  totalSteps,
  onBack,
  onSwitchMode,
}: CoachChatHeaderProps): React.JSX.Element {
  const t = useTranslations("createEntry");

  return (
    <div className="flex items-center justify-between border-b border-ds-border-subtle bg-ds-surface/80 px-ds-l py-ds-m">
      <div className="flex items-center gap-ds-m">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack || isTyping}
          className="flex h-8 w-8 items-center justify-center rounded-md text-ds-on-surface-secondary hover:bg-ds-surface-muted hover:text-ds-on-surface disabled:pointer-events-none disabled:opacity-40"
          aria-label={t("form.back")}
        >
          ←
        </button>
        <ProgressDots total={totalSteps} currentIndex={currentStepIndex} />
      </div>
      <button
        type="button"
        onClick={onSwitchMode}
        className="text-sm font-medium text-ds-on-surface-secondary hover:text-ds-interactive"
      >
        {t("form.switchToForm")}
      </button>
    </div>
  );
}
