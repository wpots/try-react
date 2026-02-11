interface HomeSplashDisabledStateInput {
  isGuest: boolean;
  isLoading: boolean;
  hasUser: boolean;
  submittingMethod: "guest" | "google" | null;
}

export interface HomeSplashDisabledState {
  isBusy: boolean;
  isGoogleDisabled: boolean;
  isGuestDisabled: boolean;
}

export function getHomeSplashDisabledState({
  isGuest,
  isLoading,
  hasUser,
  submittingMethod,
}: HomeSplashDisabledStateInput): HomeSplashDisabledState {
  const isBusy = isLoading || submittingMethod !== null;

  return {
    isBusy,
    isGoogleDisabled: isBusy || (hasUser && !isGuest),
    isGuestDisabled: isBusy || hasUser,
  };
}
