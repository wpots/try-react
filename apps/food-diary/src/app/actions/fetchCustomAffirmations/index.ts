export interface FetchCustomAffirmationsResult {
  success: boolean;
  affirmations?: string[];
  error?: string;
}

export { fetchCustomAffirmations } from "./fetchCustomAffirmations";
