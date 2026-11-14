import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publicQuestions, rankDrinks, resolvePicks, scoreProduct } from '../src/utils/quiz.js';

const PRODUCTS = [
  { productId: 1, name: 'Classic Milk Tea', category: 'Milk Tea', tags: ['creamy', 'balanced', 'caffeine'], popularity: 50 },
  { productId: 2, name: 'Taro Slush', category: 'Slush', tags: ['icy', 'creamy', 'sweet', 'caffeine-free'], popularity: 10 },
  { productId: 3, name: 'Mango Green Tea', category: 'Fruit Tea', tags: ['fruity', 'sweet', 'caffeine'], popularity: 30 },
];

test('resolvePicks maps answers to options and rejects missing answers', () => {
  const picks = resolvePicks({ flavor: 'creamy', sweetness: 'sweet', caffeine: 'yes' });
  assert.equal(picks.length, 3);
  assert.throws(() => resolvePicks({ flavor: 'creamy' }), /Please answer/);
  assert.throws(() => resolvePicks(null), /Answers are required/);
});

test('rankDrinks prefers drinks that match category and tags', () => {
  const picks = resolvePicks({ flavor: 'fruity', sweetness: 'sweet', caffeine: 'yes' });
  assert.equal(rankDrinks(PRODUCTS, picks)[0].name, 'Mango Green Tea');
});

test('choosing no caffeine removes caffeinated drinks', () => {
  const picks = resolvePicks({ flavor: 'creamy', sweetness: 'balanced', caffeine: 'no' });
  assert.deepEqual(rankDrinks(PRODUCTS, picks).map((drink) => drink.name), ['Taro Slush']);
  assert.equal(scoreProduct(PRODUCTS[0], picks), -1);
});

test('ties go to the more popular drink', () => {
  const picks = resolvePicks({ flavor: 'surprise', sweetness: 'light', caffeine: 'yes' });
  assert.deepEqual(rankDrinks(PRODUCTS, picks, 2).map((drink) => drink.productId), [1, 3]);
});

test('publicQuestions hides scoring fields', () => {
  const [question] = publicQuestions();
  assert.deepEqual(Object.keys(question.options[0]).sort(), ['id', 'label']);
});
