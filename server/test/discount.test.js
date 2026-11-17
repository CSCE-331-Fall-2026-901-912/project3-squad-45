import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyDiscount } from '../src/utils/pricing.js';

test('applyDiscount takes a percentage off and rounds to cents', () => {
  assert.deepEqual(applyDiscount(20, 10), { discountAmount: 2, total: 18 });
  assert.deepEqual(applyDiscount(5.95, 15), { discountAmount: 0.89, total: 5.06 });
});

test('applyDiscount leaves the total alone for no discount', () => {
  assert.deepEqual(applyDiscount(12.5, 0), { discountAmount: 0, total: 12.5 });
  assert.deepEqual(applyDiscount(12.5), { discountAmount: 0, total: 12.5 });
});

test('applyDiscount clamps percentages to 0-100', () => {
  assert.deepEqual(applyDiscount(10, 250), { discountAmount: 10, total: 0 });
  assert.deepEqual(applyDiscount(10, -5), { discountAmount: 0, total: 10 });
});
