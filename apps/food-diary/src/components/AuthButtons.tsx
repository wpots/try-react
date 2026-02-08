"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Card, Text } from "@repo/ui";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signInAnonymously } from "@/lib/auth";

interface AuthButtonsProps {
  redirectPath?: string;
}

export default function AuthButtons({ redirectPath = "/" }: AuthButtonsProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGuestLogin = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await signInAnonymously();
      router.push(redirectPath);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("guestLoginUnknownError");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = loading || isSubmitting;

  return (
    <Card className="grid max-w-md gap-3">
      {user ? (
        <Text>
          {isGuest ? t("signedInGuest") : t("signedInUser", { uid: user.uid })}
        </Text>
      ) : null}

      <Button
        type="button"
        onClick={handleGuestLogin}
        disabled={Boolean(user) || isBusy}
      >
        {isBusy ? t("guestLoginLoading") : t("continueAsGuest")}
      </Button>

      {error ? <Text tone="danger">{error}</Text> : null}
    </Card>
  );
}
