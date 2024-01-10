import bcrypt from "bcrypt";

/**
 * Hashes the given password using bcrypt.
 *
 * @param {string} password - The password to be hashed.
 * @return {string} - The hashed password.
 */
export function hash_password(password: string): string {
  const saltRounds: number = 2;
  return bcrypt.hashSync(password, saltRounds);
}
