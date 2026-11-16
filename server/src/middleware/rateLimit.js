import { HttpError } from '../utils/httpError.js';

// Fixed-window limiter keyed by client IP. `now` can be replaced in tests.
export function rateLimit({ windowMs, max, now = Date.now }) {
  const hits = new Map();
  return (req, res, next) => {
    const current = now();
    const entry = hits.get(req.ip);
    if (!entry || current - entry.start >= windowMs) {
      hits.set(req.ip, { start: current, count: 1 });
      // Drop stale windows so the map cannot grow without bound.
      for (const [key, value] of hits) if (current - value.start >= windowMs) hits.delete(key);
      return next();
    }
    entry.count += 1;
    if (entry.count > max) return next(new HttpError(429, 'Too many requests. Please slow down.'));
    return next();
  };
}
