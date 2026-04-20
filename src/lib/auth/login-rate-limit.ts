type RateLimitWindow = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 1000 * 60 * 10;
const MAX_REQUESTS_PER_WINDOW = 5;

const loginRateLimitStore = new Map<string, RateLimitWindow>();
const demoLoginRateLimitStore = new Map<string, RateLimitWindow>();

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

function consumeKey(store: Map<string, RateLimitWindow>, key: string, now: number) {
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, {
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
  store.set(key, current);

  return {
    allowed: true,
  } as const;
}

export function resetLoginRateLimitStore() {
  loginRateLimitStore.clear();
  demoLoginRateLimitStore.clear();
}

export function enforceWorkspaceLoginRateLimit({
  request,
  email,
  now = Date.now(),
}: {
  request: Request;
  email: string;
  now?: number;
}) {
  const ip = readClientIp(request);
  const normalizedEmail = email.trim().toLowerCase();
  const ipResult = consumeKey(loginRateLimitStore, `login:ip:${ip}`, now);

  if (!ipResult.allowed) {
    return {
      ok: false,
      retryAfterMs: ipResult.retryAfterMs,
      reason: "Zu viele Login-Anfragen. Bitte versuche es in ein paar Minuten erneut.",
    } as const;
  }

  const emailResult = consumeKey(
    loginRateLimitStore,
    `login:email:${normalizedEmail}`,
    now,
  );

  if (!emailResult.allowed) {
    return {
      ok: false,
      retryAfterMs: emailResult.retryAfterMs,
      reason: "Zu viele Login-Anfragen. Bitte versuche es in ein paar Minuten erneut.",
    } as const;
  }

  return { ok: true } as const;
}

export function enforceDemoLoginRateLimit({
  email,
  now = Date.now(),
}: {
  email: string;
  now?: number;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const emailResult = consumeKey(
    demoLoginRateLimitStore,
    `demo-login:email:${normalizedEmail}`,
    now,
  );

  if (!emailResult.allowed) {
    return {
      ok: false,
      retryAfterMs: emailResult.retryAfterMs,
      reason: "Zu viele Demo-Login-Versuche. Bitte versuche es in ein paar Minuten erneut.",
    } as const;
  }

  return { ok: true } as const;
}
