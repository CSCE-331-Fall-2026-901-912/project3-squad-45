import { CHAT } from '../settings/chat.js';
import { ORDERING } from '../config.js';
import { HttpError } from '../utils/httpError.js';
import { buildSystemPrompt, extractReply, SUGGEST_TOOL, sanitizeMessages } from '../utils/chatPrompt.js';
import { listMenu } from './menuService.js';

export const chatEnabled = () => Boolean(CHAT.API_KEY);

export async function askAssistant(rawMessages, language) {
  if (!chatEnabled()) throw new HttpError(503, 'The assistant is not available right now');
  const messages = sanitizeMessages(rawMessages);
  const menu = await listMenu();

  const response = await fetch(CHAT.API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': CHAT.API_KEY,
      'anthropic-version': CHAT.API_VERSION,
    },
    body: JSON.stringify({
      model: CHAT.MODEL,
      max_tokens: CHAT.MAX_TOKENS,
      system: buildSystemPrompt(menu, ORDERING, language),
      tools: [SUGGEST_TOOL],
      messages,
    }),
    signal: AbortSignal.timeout(CHAT.REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new HttpError(502, 'The assistant could not answer. Please try again.');
  return extractReply(await response.json(), menu);
}
