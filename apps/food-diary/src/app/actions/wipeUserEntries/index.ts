export interface WipeUserEntriesResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

export { wipeUserEntries } from "./wipeUserEntries";
