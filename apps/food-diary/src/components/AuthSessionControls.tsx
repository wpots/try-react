"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Text } from "@repo/ui";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

export function AuthSessionControls(): React.JSX.Element | null {
  const t = useTranslations("auth");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading || !user) {
    return null;
  }

  const handleSignOut = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signOut();
      router.push("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("signOutError");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid justify-items-end gap-2">
      <Text className="text-xs">
        {isGuest ? t("signedInGuest") : t("signedInUser", { uid: user.uid })}
      </Text>
      <Button type="button" onClick={handleSignOut} disabled={isSubmitting}>
        {isSubmitting ? t("signingOut") : t("signOut")}
      </Button>
      {error ? <Text tone="danger">{error}</Text> : null}
    </div>
  );
}
