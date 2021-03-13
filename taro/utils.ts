export function isUndefined(
  maybeUndefined: unknown,
): maybeUndefined is undefined {
  return typeof maybeUndefined === "undefined";
}

export function isNull(maybeNull: unknown): maybeNull is null {
  return maybeNull === null;
}

export function isString(maybeString: unknown): maybeString is string {
  return typeof maybeString === "string";
}

export function uid(len = 5): string {
  return Math.random().toString(36).slice(-len);
}
