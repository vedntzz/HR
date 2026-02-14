import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const clientMap = new Map<string, RateLimitEntry>();

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip ?? req.socket.remoteAddress ?? 'unknown';
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of clientMap.entries()) {
    if (now >= entry.resetTime) {
      clientMap.delete(key);
    }
  }
}

function startCleanupTimer(): void {
  if (cleanupInterval !== null) {
    return;
  }
  cleanupInterval = setInterval(cleanupExpiredEntries, 60000);
  cleanupInterval.unref();
}

export function resetRateLimiterState(): void {
  clientMap.clear();
  if (cleanupInterval !== null) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  startCleanupTimer();

  const clientId = getClientIdentifier(req);
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  const existing = clientMap.get(clientId);

  if (!existing || now >= existing.resetTime) {
    clientMap.set(clientId, {
      count: 1,
      resetTime: now + windowMs,
    });
    setRateLimitHeaders(res, maxRequests, maxRequests - 1, now + windowMs);
    next();
    return;
  }

  existing.count += 1;

  if (existing.count > maxRequests) {
    const retryAfterSeconds = Math.ceil((existing.resetTime - now) / 1000);
    setRateLimitHeaders(res, maxRequests, 0, existing.resetTime);
    res.setHeader('Retry-After', retryAfterSeconds.toString());
    res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
      retryAfter: retryAfterSeconds,
    });
    return;
  }

  const remaining = maxRequests - existing.count;
  setRateLimitHeaders(res, maxRequests, remaining, existing.resetTime);
  next();
}

function setRateLimitHeaders(
  res: Response,
  limit: number,
  remaining: number,
  resetTime: number
): void {
  res.setHeader('X-RateLimit-Limit', limit.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining).toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
}
