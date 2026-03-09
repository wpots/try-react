interface AffirmationKey {
  key: string;
  order: number;
}

function getAffirmationOrder(key: string): number | null {
  if (!/^a\d+$/.test(key)) {
    return null;
  }

  return Number.parseInt(key.slice(1), 10);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export function getAffirmationPool(
  translate: (key: string) => string,
  getRawMessage: (key: string) => unknown,
  customAffirmations?: string[],
): string[] {
  const rawAffirmations = getRawMessage("affirmations");

  if (!isRecord(rawAffirmations)) {
    return customAffirmations?.length ? [...customAffirmations] : [];
  }

  const affirmationKeys = Object.keys(rawAffirmations)
    .map((key): AffirmationKey | null => {
      const order = getAffirmationOrder(key);

      if (order == null) {
        return null;
      }

      return { key, order };
    })
    .filter((value): value is AffirmationKey => value != null)
    .sort((left, right) => left.order - right.order);

  const builtIn = affirmationKeys.map(({ key }) => translate(`affirmations.${key}`));

  if (customAffirmations?.length) {
    return [...builtIn, ...customAffirmations];
  }

  return builtIn;
}
