const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

type LoginAttempt = {
  failures: number;
  resetAt: number;
};

const attempts = new Map<string, LoginAttempt>();

function pruneExpiredAttempts(now: number) {
  for (const [key, attempt] of attempts) {
    if (attempt.resetAt <= now) attempts.delete(key);
  }
}

export function getLoginAttemptKey(request: Request, email: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip")?.trim() || "unknown";
  return `${address}:${email.trim().toLowerCase()}`;
}

export function isLoginAllowed(key: string) {
  const now = Date.now();
  pruneExpiredAttempts(now);

  const attempt = attempts.get(key);
  return !attempt || attempt.resetAt <= now || attempt.failures < MAX_FAILURES;
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  pruneExpiredAttempts(now);

  const attempt = attempts.get(key);
  if (!attempt) {
    attempts.set(key, { failures: 1, resetAt: now + WINDOW_MS });
    return;
  }

  attempt.failures += 1;
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
