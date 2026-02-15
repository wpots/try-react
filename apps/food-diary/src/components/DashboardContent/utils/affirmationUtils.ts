export function pickAffirmation(
  dateKey: string,
  affirmations: readonly string[],
): string {
  if (affirmations.length === 0) {
    return "";
  }

  let hash = 0;

  for (const char of dateKey) {
    hash = (hash * 31 + char.charCodeAt(0)) % 2147483647;
  }

  const index = Math.abs(hash) % affirmations.length;

  return affirmations[index] ?? affirmations[0] ?? "";
}
