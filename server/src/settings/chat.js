import 'dotenv/config';

// Settings for the menu assistant (Anthropic Claude).
export const CHAT = {
  API_URL: 'https://api.anthropic.com/v1/messages',
  API_VERSION: '2023-06-01',
  API_KEY: process.env.ANTHROPIC_API_KEY || '',
  MODEL: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
  MAX_TOKENS: 400,
  REQUEST_TIMEOUT_MS: 20_000,
  MAX_MESSAGES: 12,
  MAX_MESSAGE_LENGTH: 500,
  MAX_SUGGESTIONS: 3,
  RATE_LIMIT: { windowMs: 60_000, max: 15 },
};
