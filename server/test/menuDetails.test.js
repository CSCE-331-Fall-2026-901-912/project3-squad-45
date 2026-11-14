import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildDetail, containsCaffeine, inferAllergens, isFoodItem } from '../src/utils/menuDetails.js';

const MILK_TEA = { productId: 1, name: 'Classic Milk Tea', category: 'Milk Tea', price: 5.5 };
const RECIPE = [{ name: 'Milk' }, { name: 'Black Tea Leaves' }, { name: 'Simple Syrup' }, { name: 'Cups (24 oz)' }, { name: 'Straws' }];

test('isFoodItem filters out cups, lids and straws', () => {
  assert.equal(isFoodItem('Cups (24 oz)'), false);
  assert.equal(isFoodItem('Straws'), false);
  assert.equal(isFoodItem('Tapioca Pearls'), true);
});

test('inferAllergens flags milk from milk and creamer', () => {
  assert.deepEqual(inferAllergens(['Milk', 'Black Tea Leaves']), ['Milk']);
  assert.deepEqual(inferAllergens(['Non-Dairy Creamer']), ['Milk']);
  assert.deepEqual(inferAllergens(['Mango Syrup']), []);
});

test('containsCaffeine detects tea leaves and matcha only', () => {
  assert.equal(containsCaffeine(['Green Tea Leaves']), true);
  assert.equal(containsCaffeine(['Matcha Powder']), true);
  assert.equal(containsCaffeine(['Taro Powder']), false);
});

test('buildDetail lists ingredients without supplies and writes a plain summary', () => {
  const detail = buildDetail(MILK_TEA, RECIPE);
  assert.deepEqual(detail.ingredients, ['Milk', 'Black Tea Leaves', 'Simple Syrup']);
  assert.deepEqual(detail.allergens, ['Milk']);
  assert.equal(detail.hasCaffeine, true);
  assert.match(detail.plainDescription, /^Classic Milk Tea is a milk tea drink\./);
  assert.match(detail.plainDescription, /It has caffeine\.$/);
});

test('plain summary says when a drink has no caffeine', () => {
  const detail = buildDetail({ ...MILK_TEA, name: 'Taro Slush', category: 'Slush' }, [{ name: 'Taro Powder' }]);
  assert.match(detail.plainDescription, /It has no caffeine\.$/);
});
