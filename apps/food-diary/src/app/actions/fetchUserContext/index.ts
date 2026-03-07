export interface FetchUserContextResult {
  success: boolean;
  context?: {
    company?: string;
    location?: string;
    behaviour?: string;
  };
  error?: string;
}

export { fetchUserContext } from "./fetchUserContext";
