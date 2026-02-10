"use client";

import { EntryOverviewView } from "./EntryOverviewView";
import { useEntryOverview } from "./useEntryOverview";

export default function EntryOverview(): React.JSX.Element {
  const { entries, title } = useEntryOverview();

  return <EntryOverviewView entries={entries} title={title} />;
}
