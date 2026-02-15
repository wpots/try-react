function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getCmsValue(
  cms: Record<string, unknown>,
  key: string,
): unknown {
  return key.split(".").reduce<unknown>((current, part) => {
    if (!isRecord(current)) {
      return undefined;
    }

    return current[part];
  }, cms);
}

export function getCmsText(
  cms: Record<string, unknown>,
  key: string,
): string {
  const value = getCmsValue(cms, key);
  return typeof value === "string" ? value : key;
}

export function getCmsNamespace(
  messages: unknown,
  namespace: string,
): Record<string, unknown> {
  if (!isRecord(messages)) {
    return {};
  }

  const value = messages[namespace];
  return isRecord(value) ? value : {};
}
