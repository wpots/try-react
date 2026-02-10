import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/auth";

export interface UseAuthSessionControlsResult {
  canRender: boolean;
  error: string | null;
  isSubmitting: boolean;
  onSignOut: () => Promise<void>;
  userUid: string;
}

export function useAuthSessionControls(): UseAuthSessionControlsResult {
  const t = useTranslations("auth");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async (): Promise<void> => {
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

  return {
    canRender: !loading && Boolean(user) && !isGuest,
    error,
    isSubmitting,
    onSignOut: handleSignOut,
    userUid: user?.uid ?? "",
  };
}
