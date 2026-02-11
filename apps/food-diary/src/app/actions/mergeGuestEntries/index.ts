export interface MergeGuestEntriesResult {
  success: boolean;
  mergedCount: number;
  error?: string;
}

export { mergeGuestEntries } from "./mergeGuestEntries";
