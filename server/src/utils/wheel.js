import { GAME } from '../settings/game.js';

// Weighted random choice. `random` returns a number in [0, 1) and can be replaced in tests.
export function pickSegment(segments = GAME.SEGMENTS, random = Math.random) {
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  let target = random() * totalWeight;
  for (const segment of segments) {
    target -= segment.weight;
    if (target < 0) return segment;
  }
  return segments[segments.length - 1];
}

export function generateCode(random = Math.random, length = GAME.CODE_LENGTH, alphabet = GAME.CODE_ALPHABET) {
  return Array.from({ length }, () => alphabet[Math.floor(random() * alphabet.length)]).join('');
}

export const normalizeCode = (value) => (typeof value === 'string' ? value.trim().toUpperCase() : '');

// What the browser may know about the wheel: no odds.
export const publicSegments = (segments = GAME.SEGMENTS) =>
  segments.map(({ id, label, percent }) => ({ id, label, percent }));
