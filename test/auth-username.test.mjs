import test from 'node:test';
import assert from 'node:assert/strict';
import {
  signInOnServer, INVALID_CREDENTIALS_MESSAGE, MISSING_CREDENTIALS_MESSAGE,
  RATE_LIMITED_MESSAGE, EMAIL_NOT_CONFIRMED_MESSAGE, SIGN_IN_FAILED_MESSAGE,
} from '../src/lib/server-sign-in.ts';
import { parseUsername } from '../src/lib/username.ts';
import { isRateLimited, resetRateLimits } from '../src/lib/rate-limit.ts';

const tokens = { access_token: 'a', refresh_token: 'r', extra: 'must-not-leak' };
const deps = (over = {}) => ({
  findEmailByUsername: async name => (name === 'daisy' ? 'daisy@example.com' : null),
  signInWithPassword: async () => ({ session: tokens, error: null }),
  ...over,
});

test('valid username returns only the two tokens, never the email', async () => {
  const res = await signInOnServer({ username: '  Daisy ', password: 'pw' }, deps());
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { session: { access_token: 'a', refresh_token: 'r' } });
});

test('looks the account up by the lowercase username and signs in with its email', async () => {
  let seen;
  await signInOnServer({ username: 'DAISY', password: 'pw' }, deps({
    signInWithPassword: async (email, password) => { seen = { email, password }; return { session: tokens, error: null }; },
  }));
  assert.deepEqual(seen, { email: 'daisy@example.com', password: 'pw' });
});

test('unknown username and wrong password are indistinguishable', async () => {
  const unknown = await signInOnServer({ username: 'ghost', password: 'pw' }, deps());
  const wrong = await signInOnServer({ username: 'daisy', password: 'bad' }, deps({
    signInWithPassword: async () => ({ session: null, error: { code: 'invalid_credentials', status: 400 } }),
  }));
  assert.deepEqual(unknown, wrong);
  assert.equal(unknown.status, 401);
  assert.equal(unknown.body.error, INVALID_CREDENTIALS_MESSAGE);
});

test('banned account looks like a wrong password', async () => {
  const res = await signInOnServer({ username: 'daisy', password: 'pw' }, deps({
    signInWithPassword: async () => ({ session: null, error: { code: 'user_banned', status: 400 } }),
  }));
  assert.equal(res.status, 401);
});

test('missing or malformed input is a 400 and never reaches the lookup', async () => {
  let called = false;
  const d = deps({ findEmailByUsername: async () => { called = true; return null; } });
  for (const input of [null, {}, { username: 'daisy' }, { password: 'pw' }, { username: 5, password: 'pw' }, { username: 'daisy', password: 'x'.repeat(2000) }]) {
    const res = await signInOnServer(input, d);
    assert.equal(res.status, 400);
    assert.equal(res.body.error, MISSING_CREDENTIALS_MESSAGE);
  }
  assert.equal(called, false);
});

test('over-long username is refused without a lookup', async () => {
  let called = false;
  const res = await signInOnServer({ username: 'a'.repeat(50), password: 'pw' }, deps({ findEmailByUsername: async () => { called = true; return null; } }));
  assert.equal(res.status, 401);
  assert.equal(called, false);
});

test('maps rate limit, unconfirmed email and unexpected failures', async () => {
  const run = error => signInOnServer({ username: 'daisy', password: 'pw' }, deps({ signInWithPassword: async () => ({ session: null, error }) }));
  assert.deepEqual((await run({ code: 'over_request_rate_limit', status: 429 })).body.error, RATE_LIMITED_MESSAGE);
  assert.equal((await run({ code: 'email_not_confirmed', status: 400 })).body.error, EMAIL_NOT_CONFIRMED_MESSAGE);
  assert.equal((await run({ code: 'unexpected_failure' })).status, 502);
  assert.equal((await run({ code: 'unexpected_failure' })).body.error, SIGN_IN_FAILED_MESSAGE);
});

test('lookup failure is a 500 with a generic message', async () => {
  const res = await signInOnServer({ username: 'daisy', password: 'pw' }, deps({ findEmailByUsername: async () => { throw new Error('db down: secret'); } }));
  assert.equal(res.status, 500);
  assert.equal(res.body.error, SIGN_IN_FAILED_MESSAGE);
});

test('a success without both tokens is not a success', async () => {
  const res = await signInOnServer({ username: 'daisy', password: 'pw' }, deps({ signInWithPassword: async () => ({ session: { access_token: 'a' }, error: null }) }));
  assert.equal(res.status, 502);
});

test('parseUsername accepts the database format only', () => {
  assert.equal(parseUsername('  Daisy_01 '), 'daisy_01');
  assert.equal(parseUsername('b3ar.nqm'), 'b3ar.nqm');
  for (const bad of ['ab', 'a'.repeat(21), 'has space', 'daisy@x.com', 'da-isy', 'tên', '', null, 7]) assert.equal(parseUsername(bad), null);
});

test('rate limiter blocks after the limit and recovers after the window', () => {
  resetRateLimits();
  for (let i = 0; i < 3; i++) assert.equal(isRateLimited('k', 3, 1000, 0), false);
  assert.equal(isRateLimited('k', 3, 1000, 10), true);
  assert.equal(isRateLimited('other', 3, 1000, 10), false);
  assert.equal(isRateLimited('k', 3, 1000, 2000), false);
});
