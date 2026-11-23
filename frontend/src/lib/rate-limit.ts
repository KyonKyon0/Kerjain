interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const MAX_RATE_LIMIT_ENTRIES = 2000;
const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Lightweight, zero-dependency in-memory rate limiter with bounded capacity and TTL pruning
 */
export function checkRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt <= now) {
    if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
      let pruned = 0;
      for (const [k, v] of rateLimitMap.entries()) {
        if (v.resetAt <= now || pruned < 100) {
          rateLimitMap.delete(k);
          pruned++;
        }
      }
    }
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

/**
 * Extracts client IP from request headers safely
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}
