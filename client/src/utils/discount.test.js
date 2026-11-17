import assert from 'node:assert/strict';
import { test } from 'node:test';
import { previewDiscount } from './discount.js';

test('previewDiscount matches the server rounding', () => {
  assert.deepEqual(previewDiscount(20, 10), { discountAmount: 2, payable: 18 });
  assert.deepEqual(previewDiscount(5.95, 15), { discountAmount: 0.89, payable: 5.06 });
});

test('previewDiscount does nothing without a percentage and clamps bad ones', () => {
  assert.deepEqual(previewDiscount(12.5), { discountAmount: 0, payable: 12.5 });
  assert.deepEqual(previewDiscount(10, 500), { discountAmount: 10, payable: 0 });
});
