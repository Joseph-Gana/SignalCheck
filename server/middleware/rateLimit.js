const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 30;

export function createAnalyzeRateLimiter() {
  const requestsByIp = new Map();
  const windowMs = getPositiveInteger(
    process.env.RATE_LIMIT_WINDOW_MS,
    DEFAULT_WINDOW_MS
  );
  const maxRequests = getPositiveInteger(
    process.env.RATE_LIMIT_MAX,
    DEFAULT_MAX_REQUESTS
  );

  return (request, response, next) => {
    if (request.method !== 'POST') {
      next();
      return;
    }

    const now = Date.now();
    const key = request.ip || 'unknown';
    const activeRequestTimes = (
      requestsByIp.get(key)?.requestTimes || []
    ).filter(timestamp => now - timestamp < windowMs);

    if (activeRequestTimes.length >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowMs - (now - activeRequestTimes[0])) / 1000)
      );

      response
        .status(429)
        .set('Retry-After', String(retryAfterSeconds))
        .json({
          error: 'Too many analysis requests. Please wait a few minutes and try again.'
        });
      return;
    }

    activeRequestTimes.push(now);
    requestsByIp.set(key, { requestTimes: activeRequestTimes });
    next();
  };
}

function getPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}
