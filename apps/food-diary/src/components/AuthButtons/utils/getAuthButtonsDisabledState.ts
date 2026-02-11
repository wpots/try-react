interface AuthButtonsDisabledStateInput {
  isGuest: boolean;
  isLoading: boolean;
  hasUser: boolean;
  submittingMethod: "guest" | "google" | null;
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
}: AuthButtonsDisabledStateInput): AuthButtonsDisabledState {
  const isBusy = isLoading || submittingMethod !== null;

  return {
    isGoogleDisabled: isBusy || (hasUser && !isGuest),
    isGuestDisabled: isBusy || hasUser,
  };
}
