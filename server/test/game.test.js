import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GAME } from '../src/settings/game.js';
import { generateCode, normalizeCode, pickSegment, publicSegments } from '../src/utils/wheel.js';

test('pickSegment follows the weights', () => {
  const segments = [{ id: 'a', weight: 1 }, { id: 'b', weight: 3 }];
  assert.equal(pickSegment(segments, () => 0).id, 'a');
  assert.equal(pickSegment(segments, () => 0.24).id, 'a');
  assert.equal(pickSegment(segments, () => 0.26).id, 'b');
  assert.equal(pickSegment(segments, () => 0.999999).id, 'b');
});

test('configured wheel never pays more than 20 percent', () => {
  assert.ok(Math.max(...GAME.SEGMENTS.map((segment) => segment.percent)) <= 20);
  assert.ok(GAME.SEGMENTS.some((segment) => segment.percent === 0));
});

test('generateCode uses the readable alphabet and configured length', () => {
  const code = generateCode(() => 0.5);
  assert.equal(code.length, GAME.CODE_LENGTH);
  assert.ok([...code].every((char) => GAME.CODE_ALPHABET.includes(char)));
});

test('normalizeCode trims and upper-cases, and ignores non-strings', () => {
  assert.equal(normalizeCode('  ab3d '), 'AB3D');
  assert.equal(normalizeCode(undefined), '');
});

test('publicSegments hides the odds', () => {
  assert.ok(publicSegments().every((segment) => segment.weight === undefined));
});
