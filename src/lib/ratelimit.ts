import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _limiter: Ratelimit | null = null;
let _warned = false;

function getLimiter(): Ratelimit | null {
  if (_limiter) return _limiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (!_warned) {
      console.warn(
        "[ratelimit] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set — rate limiting disabled",
      );
      _warned = true;
    }
    return null;
  }

  _limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "madhuban:form",
  });

  return _limiter;
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function checkRateLimit(
  request: Request,
): Promise<{ limited: boolean; retryAfter?: number }> {
  const limiter = getLimiter();
  if (!limiter) return { limited: false };

  const ip = getClientIP(request);
  const { success, reset } = await limiter.limit(ip);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return { limited: true, retryAfter };
  }

  return { limited: false };
}
