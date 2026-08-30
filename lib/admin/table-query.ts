/**
 * Reading a console index's narrowing off the URL.
 *
 * Every index in the console keeps its search and its filter in query
 * parameters rather than in component state: it survives a reload, walks back
 * through history, and can be sent to somebody as a link. The page reads them
 * here, hands them to its store, and the database does the narrowing — which is
 * also what makes an export carry what the reader is looking at rather than
 * whatever happened to be fetched.
 */

/** The shape Next hands a page for `?a=1&b=2`. */
export type TableSearchParams = Record<string, string | string[] | undefined>;

/**
 * One parameter, trimmed, or undefined when it is absent or empty. A repeated
 * parameter is a hand-made URL; the first one is taken as the answer.
 */
export const param = (params: TableSearchParams, key: string) => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
};

/**
 * A parameter narrowed to a value the console actually knows. Anything else is
 * treated as absent, so a hand-edited query cannot put a screen into a state
 * its own controls could not reach.
 */
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

/**
 * One `contains` clause per field — the `OR` arm a search box means, on its own
 * so an index with something else to match on (a number a buyer quotes, say)
 * can add to it rather than wrap another `OR` around it.
 */
export const searchClauses = (fields: string[], search: string) =>
  fields.map((field) => ({
    [field]: { contains: search, mode: "insensitive" as const },
  }));

/**
 * The `contains` clause a search box means, spread into a Prisma `where`. Empty
 * searches spread to nothing, so the caller needs no branch of its own.
 */
export const searchAcross = (fields: string[], search?: string) =>
  search ? { OR: searchClauses(fields, search) } : {};

/** The same narrowing for the stores still backed by fixtures rather than rows. */
export const matchesSearch = (values: (string | null | undefined)[], search?: string) => {
  if (!search) return true;
  const needle = search.toLowerCase();
  return values.some((value) => value?.toLowerCase().includes(needle));
};
