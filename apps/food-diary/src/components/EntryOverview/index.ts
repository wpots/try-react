export interface EntryOverviewItem {
  id: string;
  date: string;
  time: string;
  entryType: string;
  foodEaten: string;
  description: string;
}

export interface EntryOverviewViewProps {
  title: string;
  entries: EntryOverviewItem[];
}

export { default } from "./EntryOverview";
export { default as EntryOverview } from "./EntryOverview";
export { EntryOverviewView } from "./EntryOverviewView";
