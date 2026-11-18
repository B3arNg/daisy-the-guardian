/**
 * Best-effort in-memory limiter for the sign-in route. Each serverless instance keeps its own
 * counters, so this slows scripted guessing but is not a global limit; Supabase Auth's own
 * per-IP limits still apply behind it.
 */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit = 10, windowMs = 5 * 60 * 1000, now = Date.now()) {
  for (const [k, v] of attempts) {
    if (v.resetAt <= now) attempts.delete(k);
  }
  const entry = attempts.get(key);
  if (!entry) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

export function resetRateLimits() {
  attempts.clear();
}
