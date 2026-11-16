import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyWeather, pickDrinks } from '../src/utils/weatherMood.js';

test('rain wins over temperature', () => {
  assert.equal(classifyWeather({ temperatureF: 95, weatherCode: 61 }).mood, 'rainy');
});

test('hot, cold and mild temperatures map to moods', () => {
  assert.equal(classifyWeather({ temperatureF: 95, weatherCode: 0 }).mood, 'hot');
  assert.equal(classifyWeather({ temperatureF: 40, weatherCode: 0 }).mood, 'cold');
  assert.equal(classifyWeather({ temperatureF: 72, weatherCode: 1 }).mood, 'mild');
});

test('snow counts as cold', () => {
  assert.equal(classifyWeather({ temperatureF: 70, weatherCode: 73 }).mood, 'cold');
});

test('pickDrinks keeps matching categories, most popular first, up to the limit', () => {
  const products = [
    { name: 'A', category: 'Slush', popularity: 5 },
    { name: 'B', category: 'Milk Tea', popularity: 99 },
    { name: 'C', category: 'Fruit Tea', popularity: 20 },
    { name: 'D', category: 'Slush', popularity: 50 },
  ];
  assert.deepEqual(pickDrinks(products, ['Slush', 'Fruit Tea'], 2).map((p) => p.name), ['D', 'C']);
});
