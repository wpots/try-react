"use client";

import { OverviewCard } from "@repo/ui";
import { groupEntriesByDate } from "./helpers";
import type { EntryOverviewViewProps } from "./index";

export function EntryOverviewView({
  title,
  entries,
}: EntryOverviewViewProps): React.JSX.Element {
  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {groupedEntries.map((group) => (
        <section className="space-y-2" key={group.date}>
          <h3 className="text-lg font-medium">{group.date}</h3>
          {group.entries.map((entry) => (
            <OverviewCard
              description={entry.description}
              key={entry.id}
              subtitle={`${entry.entryType} - ${entry.time}`}
              title={entry.foodEaten}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
