import { CHAT } from '../settings/chat.js';
import { badRequest } from './httpError.js';

export const SUGGEST_TOOL = {
  type: 'function',
  function: {
    name: 'suggest_drinks',
    description: 'Show the customer drinks from the menu as tappable suggestions. Always also write a short text reply.',
    parameters: {
      type: 'object',
      properties: {
        productIds: {
          type: 'array',
          items: { type: 'integer' },
          description: `Menu product ids, at most ${CHAT.MAX_SUGGESTIONS}`,
        },
      },
      required: ['productIds'],
    },
  },
};

// The system prompt carries the live menu so answers match what is actually for sale.
export function buildSystemPrompt(menu, ordering, language = 'en') {
  const drinks = menu
    .map((item) => `- id ${item.productId}: ${item.name} ($${item.price.toFixed(2)}, ${item.category})${item.description ? `. ${item.description}` : ''}`)
    .join('\n');
  return [
    'You are the friendly ordering assistant on the Reveille Brew Co. bubble tea kiosk in College Station, Texas.',
    'Help customers choose drinks and understand the menu. Keep replies under 60 words, in short plain sentences.',
    'Only talk about the menu and ordering. If asked something else, politely steer back to drinks.',
    `Reply in the language with code "${language}" unless the customer writes in another language.`,
    'Never invent drinks, prices or ingredients. If unsure, say so.',
    'When you recommend drinks, call suggest_drinks with their ids and also write a short text reply.',
    `Toppings cost $${ordering.TOPPING_PRICE.toFixed(2)} each (up to ${ordering.MAX_TOPPINGS}): ${ordering.TOPPINGS.join(', ')}.`,
    `Ice levels: ${ordering.ICE_LEVELS.join(', ')}. Sweetness levels: ${ordering.SUGAR_LEVELS.map((level) => level.label).join(', ')}.`,
    'Menu:',
    drinks,
  ].join('\n');
}

// Validates and trims the chat history sent by the browser.
export function sanitizeMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) throw badRequest('Send at least one message');
  const recent = messages.slice(-CHAT.MAX_MESSAGES);
  const cleaned = recent.map((message) => ({
    role: message?.role,
    content: typeof message?.content === 'string' ? message.content.trim().slice(0, CHAT.MAX_MESSAGE_LENGTH) : '',
  }));
  if (!cleaned.every((message) => ['user', 'assistant'].includes(message.role) && message.content)) {
    throw badRequest('Messages need a role of user or assistant and some text');
  }
  // The API needs the conversation to start with, and end on, a customer message.
  while (cleaned.length && cleaned[0].role !== 'user') cleaned.shift();
  if (!cleaned.length || cleaned[cleaned.length - 1].role !== 'user') {
    throw badRequest('The last message must come from the customer');
  }
  return cleaned;
}

// Pulls the text reply and the valid drink suggestions out of an API response.


// Pulls the text reply and the valid drink suggestions out of an API response.
export function extractReply(response, menu) {
  const message = response.choices?.[0]?.message ?? {};
  // Some Nemotron variants leak <think> blocks into content; strip them.
  const text = (message.content ?? '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  const requestedIds = (message.tool_calls ?? [])
    .filter((call) => call.function?.name === SUGGEST_TOOL.function.name)
    .flatMap((call) => {
      try { return JSON.parse(call.function.arguments).productIds ?? []; }
      catch { return []; }
    })
    .map(Number);

  const byId = new Map(menu.map((item) => [item.productId, item]));
  const suggestions = [...new Set(requestedIds)]
    .filter((id) => byId.has(id))
    .slice(0, CHAT.MAX_SUGGESTIONS)
    .map((id) => byId.get(id));

  return {
    reply: text || (suggestions.length ? 'Here are some drinks you might like.' : 'Sorry, I could not find an answer. Could you ask another way?'),
    suggestions,
  };
}
