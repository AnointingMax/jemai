import * as Yup from "yup";

/**
 * The shape every server action in this project returns. A caller narrows on
 * `error` alone: the success arm carries `data`, the failure arm carries a
 * message that is safe to put in front of a user.
 */
export type ActionResult<T> =
  | { error: false; data: T }
  | { error: true; message: string };

/**
 * An action with nothing to hand back still carries something: `ActionResult<string>`,
 * where the data is the line to show the reader. It keeps the success arm as
 * useful as the failure arm, which always has its `message`.
 */
export const ok = <T,>(data: T): ActionResult<T> => ({ error: false, data });

export const fail = (message: string): ActionResult<never> => ({
  error: true,
  message,
});

/**
 * Validates `values` against `schema` and hands back the same result shape, so
 * an action can `if (parsed.error) return parsed;` and carry on with typed data.
 * `abortEarly` is off so yup collects every problem, but only the first message
 * is surfaced — the contract carries one string, and the toast shows one line.
 */
export const validate = async <S extends Yup.AnySchema>(
  schema: S,
  values: unknown,
): Promise<ActionResult<Yup.InferType<S>>> => {
  try {
    // `validate` widens optional keys in its own return type; the schema's
    // inferred type is the one the caller asked for, so it wins.
    const data = (await schema.validate(values, {
      abortEarly: false,
      stripUnknown: true,
    })) as Yup.InferType<S>;
    return ok(data);
  } catch (error) {
    if (error instanceof Yup.ValidationError)
      return fail(error.errors[0] ?? error.message);
    throw error;
  }
};

/**
 * The catch-all for an action's unexpected failures. The real error goes to the
 * server log and the caller gets `message` — a database or bcrypt failure must
 * never reach the toast verbatim.
 */
export const failWith = (message: string, cause: unknown): ActionResult<never> => {
  console.error(message, cause);
  return fail(message);
};
