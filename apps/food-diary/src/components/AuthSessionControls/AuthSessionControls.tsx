"use client";

import { useTranslations } from "next-intl";
import { Button, Text } from "@repo/ui";
import { useAuthSessionControls } from "./useAuthSessionControls";

export function AuthSessionControls(): React.JSX.Element | null {
  const t = useTranslations("auth");
  const { canRender, error, isSubmitting, onSignOut, userUid } =
    useAuthSessionControls();

  if (!canRender) {
    return null;
  }

  return (
    <div className="grid justify-items-end gap-2">
      <Text className="text-xs">{t("signedInUser", { uid: userUid })}</Text>
      <Button disabled={isSubmitting} onClick={onSignOut} type="button">
        {isSubmitting ? t("signingOut") : t("signOut")}
      </Button>
      {error ? <Text tone="danger">{error}</Text> : null}
    </div>
  );
}
