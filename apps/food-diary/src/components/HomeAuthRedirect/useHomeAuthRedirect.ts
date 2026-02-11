import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@/i18n/navigation";
import { shouldRedirectToDashboard } from "./utils";

export function useHomeAuthRedirect(): void {
  const router = useRouter();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (shouldRedirectToDashboard(loading, Boolean(user))) {
      router.replace("/dashboard");
    }
  }, [loading, router, user]);
}
