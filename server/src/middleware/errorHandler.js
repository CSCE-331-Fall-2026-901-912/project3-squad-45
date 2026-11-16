import { HttpError } from '../utils/httpError.js';

export function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  const status = error.status ?? 500;
  if (status >= 500) console.error(error);
  // Messages from errors we threw on purpose (such as "assistant unavailable") are safe to show;
  // anything unexpected stays generic so internals never leak.
  const expected = error instanceof HttpError;
  res.status(status).json({
    error: status >= 500 && !expected ? 'Internal server error' : error.message,
    details: error.details,
  });
}
