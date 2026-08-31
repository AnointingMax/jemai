export type TableSearchParams = Record<string, string | string[] | undefined>;

export const param = (params: TableSearchParams, key: string) => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
};

export const paramOneOf = <T extends string>(
  params: TableSearchParams,
  key: string,
  allowed: readonly T[],
): T | undefined => {
  const value = param(params, key);
  return value && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
};

export const searchClauses = (fields: string[], search: string) =>
  fields.map((field) => ({
    [field]: { contains: search, mode: "insensitive" as const },
  }));

export const searchAcross = (fields: string[], search?: string) =>
  search ? { OR: searchClauses(fields, search) } : {};
