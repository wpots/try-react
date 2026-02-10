export function shouldRedirectToDashboard(
  isLoading: boolean,
  hasUser: boolean,
): boolean {
  return !isLoading && hasUser;
}
