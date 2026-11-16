import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ORDERING } from '../src/config.js';
import { rateLimit } from '../src/middleware/rateLimit.js';
import { buildSystemPrompt, extractReply, sanitizeMessages } from '../src/utils/chatPrompt.js';

const MENU = [
  { productId: 1, name: 'Classic Milk Tea', price: 5.5, category: 'Milk Tea', description: 'Smooth and creamy.' },
  { productId: 2, name: 'Mango Slush', price: 5.75, category: 'Slush' },
];

test('system prompt lists the live menu and options', () => {
  const prompt = buildSystemPrompt(MENU, ORDERING, 'es');
  assert.match(prompt, /id 1: Classic Milk Tea \(\$5\.50, Milk Tea\)\. Smooth and creamy\./);
  assert.match(prompt, /Mango Slush/);
  assert.match(prompt, /Tapioca Pearls/);
  assert.match(prompt, /"es"/);
});

test('sanitizeMessages trims, limits and requires a final customer message', () => {
  assert.deepEqual(sanitizeMessages([{ role: 'user', content: '  hi  ' }]), [{ role: 'user', content: 'hi' }]);
  assert.equal(sanitizeMessages([{ role: 'user', content: 'x'.repeat(2000) }])[0].content.length, 500);
  assert.throws(() => sanitizeMessages([]), /at least one/);
  assert.throws(() => sanitizeMessages([{ role: 'system', content: 'hi' }]), /role/);
  assert.throws(() => sanitizeMessages([{ role: 'user', content: 'a' }, { role: 'assistant', content: 'b' }]), /last message/);
});

test('sanitizeMessages drops a leading assistant message', () => {
  const messages = sanitizeMessages([{ role: 'assistant', content: 'Hello' }, { role: 'user', content: 'Hi' }]);
  assert.deepEqual(messages, [{ role: 'user', content: 'Hi' }]);
});

test('extractReply returns text and only real menu suggestions', () => {
  const response = { content: [
    { type: 'text', text: 'Try these!' },
    { type: 'tool_use', name: 'suggest_drinks', input: { productIds: [2, 999, 2, 1] } },
  ] };
  const { reply, suggestions } = extractReply(response, MENU);
  assert.equal(reply, 'Try these!');
  assert.deepEqual(suggestions.map((item) => item.productId), [2, 1]);
});

test('extractReply falls back to a friendly line when the model sends no text', () => {
  const noText = extractReply({ content: [{ type: 'tool_use', name: 'suggest_drinks', input: { productIds: [1] } }] }, MENU);
  assert.match(noText.reply, /drinks you might like/);
  assert.match(extractReply({ content: [] }, MENU).reply, /Sorry/);
});

test('rateLimit blocks after max requests and resets after the window', () => {
  let clock = 0;
  const limiter = rateLimit({ windowMs: 1000, max: 2, now: () => clock });
  const outcomes = [];
  const call = () => limiter({ ip: '1.1.1.1' }, {}, (error) => outcomes.push(error?.status ?? 'ok'));
  call(); call(); call();
  clock = 1500;
  call();
  assert.deepEqual(outcomes, ['ok', 'ok', 429, 'ok']);
});
