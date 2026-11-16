import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultLine } from './defaultLine.js';

test('defaultLine uses the menu price and default ice and sweetness', () => {
  const line = defaultLine(
    { productId: 4, name: 'Matcha Milk Tea', price: 6.5 },
    { defaultIceLevel: 'Regular', defaultSugarLevel: 0.5 },
  );
  assert.deepEqual(line, {
    productId: 4, name: 'Matcha Milk Tea', toppings: [], iceLevel: 'Regular', sugarLevel: 0.5, quantity: 1, unitPrice: 6.5,
  });
});
