export function getAffirmationPool(
  translate: (key: string) => string,
): string[] {
  const affirmationPool: string[] = [];
  const maxAffirmations = 50;

  for (let index = 1; index <= maxAffirmations; index += 1) {
    const affirmationKey = `affirmations.a${index}`;

    try {
      const affirmation = translate(affirmationKey);

      if (affirmation === affirmationKey) {
        break;
      }

      affirmationPool.push(affirmation);
    } catch {
      break;
    }
  }

  return affirmationPool;
}
