type RateLimitWindow = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 1000 * 60 * 10;
const MAX_REQUESTS_PER_WINDOW = 5;

const intakeRateLimitStore = new Map<string, RateLimitWindow>();

function readClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function consumeKey(key: string, now: number) {
  const current = intakeRateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    intakeRateLimitStore.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return {
      allowed: true,
    } as const;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterMs: current.resetAt - now,
    } as const;
  }

  current.count += 1;
  intakeRateLimitStore.set(key, current);

  return {
    allowed: true,
  } as const;
}

export function resetIntakeRateLimitStore() {
  intakeRateLimitStore.clear();
}

export function enforceIntakeRateLimit({
  request,
  flow,
  email,
  now = Date.now(),
}: {
  request: Request;
  flow: "brand" | "creative";
  email: string;
  now?: number;
}) {
  const ip = readClientIp(request);
  const normalizedEmail = email.trim().toLowerCase();
  const ipResult = consumeKey(`ip:${flow}:${ip}`, now);

  if (!ipResult.allowed) {
    return {
      ok: false,
      retryAfterMs: ipResult.retryAfterMs,
      reason: "Zu viele Anfragen. Bitte versuche es in ein paar Minuten erneut.",
    } as const;
  }

  const emailResult = consumeKey(`email:${flow}:${normalizedEmail}`, now);

  if (!emailResult.allowed) {
    return {
      ok: false,
      retryAfterMs: emailResult.retryAfterMs,
      reason: "Zu viele Anfragen. Bitte versuche es in ein paar Minuten erneut.",
    } as const;
  }

  return {
    ok: true,
  } as const;
}
