"use client";

import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { syncAnalyticsUser } from "@/lib/analytics";

export function AnalyticsUserSync(): null {
  const { user } = useAuth();

  useEffect(() => {
    syncAnalyticsUser(user && !user.isAnonymous ? user.uid : null);
  }, [user]);

  return null;
}
