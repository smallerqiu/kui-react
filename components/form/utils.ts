const parsePath = (path: string) =>
  path
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".");

export const getByPath = (object: Record<string, unknown>, path: string) => {
  const keys = parsePath(path);
  let parent: Record<string, unknown> | undefined = object;
  for (let index = 0; index < keys.length - 1; index++) {
    const next: unknown = parent?.[keys[index]];
    parent =
      typeof next === "object" && next !== null ? (next as Record<string, unknown>) : undefined;
  }
  const key = keys.at(-1)!;
  return { parent, key, value: parent?.[key] };
};

export const setByPath = (
  object: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> => {
  const keys = parsePath(path);
  const result: Record<string, unknown> = { ...object };
  let source: unknown = object;
  let target: Record<string, unknown> = result;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      target[key] = value;
      return;
    }
    const sourceValue =
      typeof source === "object" && source !== null
        ? (source as Record<string, unknown>)[key]
        : undefined;
    const next = Array.isArray(sourceValue)
      ? [...sourceValue]
      : typeof sourceValue === "object" && sourceValue !== null
        ? { ...(sourceValue as Record<string, unknown>) }
        : {};
    target[key] = next;
    target = next as Record<string, unknown>;
    source = sourceValue;
  });
  return result;
};
