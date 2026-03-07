interface AuthButtonsDisabledStateInput {
  isGuest: boolean;
  isLoading: boolean;
  hasUser: boolean;
  submittingMethod: "guest" | "google" | null;
  externalBusy?: boolean;
}

export interface AuthButtonsDisabledState {
  isGoogleDisabled: boolean;
  isGuestDisabled: boolean;
}

export function getAuthButtonsDisabledState({
  isGuest,
  isLoading,
  hasUser,
  submittingMethod,
  externalBusy = false,
}: AuthButtonsDisabledStateInput): AuthButtonsDisabledState {
  const isBusy = isLoading || submittingMethod !== null || externalBusy;

  return {
    isGoogleDisabled: isBusy || (hasUser && !isGuest),
    isGuestDisabled: isBusy || hasUser,
  };
}
