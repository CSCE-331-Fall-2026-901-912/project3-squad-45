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
      authorization: `Bearer ${CHAT.API_KEY}`,
    },
    body: JSON.stringify({
      model: CHAT.MODEL,
      max_tokens: CHAT.MAX_TOKENS,
      temperature: 0.4,
      messages: [
        { role: 'system', content: buildSystemPrompt(menu, ORDERING, language) },
        ...messages,
      ],
      tools: [SUGGEST_TOOL],
      tool_choice: 'auto',
    }),
    signal: AbortSignal.timeout(CHAT.REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    console.error('Assistant API error', response.status, await response.text().catch(() => ''));
    throw new HttpError(502, 'The assistant could not answer. Please try again.');
  }
  return extractReply(await response.json(), menu);
}