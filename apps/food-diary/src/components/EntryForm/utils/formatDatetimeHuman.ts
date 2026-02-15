const LABELS: Record<string, { today: string; yesterday: string }> = {
  nl: { today: "vandaag", yesterday: "gisteren" },
  en: { today: "today", yesterday: "yesterday" },
};

/**
 * Formats date (YYYY-MM-DD) and time (HH:mm) for display:
 * - today 13:36 | vandaag 13:36
 * - yesterday 12:15 | gisteren 12:15
 * - 12 februari 2026 | February 12, 2026
 */
export function formatDatetimeHuman(
  dateStr: string,
  timeStr: string,
  locale = "nl",
): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const entryDate = new Date(y, (m ?? 1) - 1, d ?? 1);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const labels = LABELS[locale] ?? LABELS.nl;
  const time = timeStr || "00:00";

  if (entryDate.getTime() === today.getTime()) {
    return `${labels.today} ${time}`;
  }
  if (entryDate.getTime() === yesterday.getTime()) {
    return `${labels.yesterday} ${time}`;
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(entryDate);
}
