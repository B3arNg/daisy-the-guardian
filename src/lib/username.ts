/** Username rules shared by the sign-up form and the database check constraint (profiles_username_format). */
export const USERNAME_PATTERN = /^[a-z0-9_.]{3,20}$/;
export const USERNAME_HINT = '3-20 characters: a-z, 0-9, underscore and dot.';

/** Trimmed, lowercased value, or null when it is not a valid username. */
export function parseUsername(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  return USERNAME_PATTERN.test(normalized) ? normalized : null;
}
