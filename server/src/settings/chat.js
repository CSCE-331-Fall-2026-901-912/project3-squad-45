import 'dotenv/config';

export const CHAT = {
  API_URL: process.env.LLM_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions',
  API_KEY: process.env.NVIDIA_API_KEY || '',
  MODEL: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-super-120b-a12b',
  MAX_TOKENS: 1000, // raised: reasoning models spend tokens thinking before they answer
  REQUEST_TIMEOUT_MS: 30_000,
  MAX_MESSAGES: 12,
  MAX_MESSAGE_LENGTH: 500,
  MAX_SUGGESTIONS: 3,
  RATE_LIMIT: { windowMs: 60_000, max: 15 },
};



