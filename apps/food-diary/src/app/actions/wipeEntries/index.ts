export interface WipeEntriesResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

export { wipeEntries } from "./wipeEntries";
