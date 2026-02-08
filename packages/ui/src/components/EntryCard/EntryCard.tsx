"use client";

import type { EntryCardProps } from "./index";

export const EntryCard = ({ foodEaten, description, time, entryType }: EntryCardProps) => {
  return (
    <article className="min-w-0 rounded-lg border border-border-300 bg-surface-50 p-4">
      <h4 className="text-lg font-semibold text-text-900">{foodEaten}</h4>
      <p className="mt-1 text-sm text-text-700">
        {entryType} - {time}
      </p>
      <p className="mt-2 text-sm text-text-900">{description}</p>
    </article>
  );
};
