"use client";

import { useLocale, useTranslations } from "next-intl";

import { useAuth } from "@/contexts/AuthContext";

import { useCoachChatFlow, UseCoachChatFlowResult } from "./hooks/useCoachChatFlow";
import { useCoachChatMessaging } from "./hooks/useCoachChatMessaging";
import { useCoachChatPersistence } from "./hooks/useCoachChatPersistence";

import type { CoachChatMessage } from "./hooks/useCoachChatMessaging";
import type { CoachChatProps } from "./index";

export interface UseCoachChatControllerResult extends UseCoachChatFlowResult {
  messages: CoachChatMessage[];
  isTyping: boolean;
  isSaving: boolean;
  saveError: string | null;
}

export function useCoachChatController({
  entryId,
  initialMode = "chat",
  onComplete,
}: CoachChatProps): UseCoachChatControllerResult {
  const { user } = useAuth();
  const locale = useLocale();
  const t = useTranslations("entry");

  const messaging = useCoachChatMessaging({ locale, t });
  const persistence = useCoachChatPersistence({ entryId, user, t });
  const flow = useCoachChatFlow({
    initialMode,
    onComplete,
    locale,
    t,
    messaging,
    persistence,
  });

  return {
    ...flow,
    messages: messaging.messages,
    isTyping: messaging.isTyping,
    isSaving: persistence.isSaving,
    saveError: persistence.saveError,
  };
}
