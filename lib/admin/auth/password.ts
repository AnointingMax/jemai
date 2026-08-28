import bcrypt from "bcrypt";

/** Work factor for bcrypt. Raise as hardware gets faster; existing hashes carry
 *  their own cost, so old rows keep verifying after a bump. */
const SALT_ROUNDS = 12;

export const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);

export const verifyPassword = (password: string, passwordHash: string) =>
  bcrypt.compare(password, passwordHash);

/** True when a stored hash predates the current cost and should be re-hashed on
 *  the next successful sign-in. */
export const needsRehash = (passwordHash: string) =>
  bcrypt.getRounds(passwordHash) < SALT_ROUNDS;
