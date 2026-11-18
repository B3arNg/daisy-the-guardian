/**
 * Username sign-in, run on the server. Supabase Auth signs in by email only, so the server maps
 * the username to its email and signs in itself; the browser only receives session tokens, and
 * only for the right password. The email behind a username never leaves the server.
 *
 * An unknown username and a wrong password get the same status and message. An unknown username
 * still answers sooner (no password is checked), so existence can leak by timing.
 *
 * Pure: the route injects the lookup and the Supabase call. Tested in test/server-sign-in.test.ts.
 */

export const INVALID_CREDENTIALS_MESSAGE = 'Wrong username or password.';
export const MISSING_CREDENTIALS_MESSAGE = 'Enter your username and password.';
export const RATE_LIMITED_MESSAGE = 'Too many sign-in attempts. Try again in a few minutes.';
export const EMAIL_NOT_CONFIRMED_MESSAGE = 'This account has not confirmed its email yet.';
export const SIGN_IN_FAILED_MESSAGE = 'Could not sign in. Try again.';

const MAX_PASSWORD_LENGTH = 1024;
const MAX_USERNAME_LENGTH = 20;

export interface SessionTokens {
  access_token: string;
  refresh_token: string;
}

export interface PasswordSignInResult {
  session: SessionTokens | null;
  /** Supabase Auth error, reduced to the fields this policy reads. */
  error: { code?: string; status?: number } | null;
}

export interface ServerSignInDeps {
  /** Email of the account that owns this lowercase username, or null. Throws when the lookup fails. */
  findEmailByUsername(username: string): Promise<string | null>;
  signInWithPassword(email: string, password: string): Promise<PasswordSignInResult>;
}

export type ServerSignInResponse =
  | { status: 200; body: { session: SessionTokens } }
  | { status: number; body: { error: string } };

function refuse(status: number, error: string): ServerSignInResponse {
  return { status, body: { error } };
}

/** Maps a Supabase Auth sign-in error to the response the browser sees. */
export function signInFailureResponse(error: { code?: string; status?: number }): ServerSignInResponse {
  if (error.code === 'over_request_rate_limit' || error.status === 429) {
    return refuse(429, RATE_LIMITED_MESSAGE);
  }
  // Supabase checks the password before confirmation, so only the account owner sees this.
  if (error.code === 'email_not_confirmed') {
    return refuse(403, EMAIL_NOT_CONFIRMED_MESSAGE);
  }
  // A ban is reported before the password check: keep it indistinguishable from a wrong password.
  if (error.code === 'invalid_credentials' || error.code === 'user_banned' || error.status === 400) {
    return refuse(401, INVALID_CREDENTIALS_MESSAGE);
  }
  return refuse(502, SIGN_IN_FAILED_MESSAGE);
}

export async function signInOnServer(input: unknown, deps: ServerSignInDeps): Promise<ServerSignInResponse> {
  const body = (input && typeof input === 'object' ? input : {}) as { username?: unknown; password?: unknown };
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!username || !password || password.length > MAX_PASSWORD_LENGTH) {
    return refuse(400, MISSING_CREDENTIALS_MESSAGE);
  }
  // Too long to be a username: treat as unknown without touching the database.
  if (username.length > MAX_USERNAME_LENGTH) {
    return refuse(401, INVALID_CREDENTIALS_MESSAGE);
  }

  let email: string | null;
  try {
    email = await deps.findEmailByUsername(username);
  } catch {
    return refuse(500, SIGN_IN_FAILED_MESSAGE);
  }
  if (!email) {
    return refuse(401, INVALID_CREDENTIALS_MESSAGE);
  }

  const result = await deps.signInWithPassword(email, password);
  if (result.error) {
    return signInFailureResponse(result.error);
  }
  if (!result.session?.access_token || !result.session.refresh_token) {
    return refuse(502, SIGN_IN_FAILED_MESSAGE);
  }
  return {
    status: 200,
    body: { session: { access_token: result.session.access_token, refresh_token: result.session.refresh_token } },
  };
}
