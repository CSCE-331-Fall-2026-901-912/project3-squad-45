import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chunk, isTranslatable, lookupDictionary, matchWhitespace } from './textRules.js';

test('isTranslatable needs letters and a sensible length', () => {
  assert.equal(isTranslatable('Place order'), true);
  assert.equal(isTranslatable('  $12.50 '), false);
  assert.equal(isTranslatable('7'), false);
  assert.equal(isTranslatable('x'), false);
  assert.equal(isTranslatable('a'.repeat(500)), false);
  assert.equal(isTranslatable('Café'), true);
});

test('matchWhitespace keeps the original padding', () => {
  assert.equal(matchWhitespace('  Hello ', 'Hola'), '  Hola ');
  assert.equal(matchWhitespace('Hello', ' Hola\n'), 'Hola');
});

test('chunk splits a list into groups of at most the given size', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(chunk([], 3), []);
});

test('lookupDictionary trims the text and returns undefined for unknown entries', () => {
  const dictionaries = { es: { 'Place order': 'Hacer pedido' } };
  assert.equal(lookupDictionary(dictionaries, 'es', ' Place order '), 'Hacer pedido');
  assert.equal(lookupDictionary(dictionaries, 'es', 'Unknown'), undefined);
  assert.equal(lookupDictionary(dictionaries, 'ko', 'Place order'), undefined);
});

test('lookupDictionary fills templates and translates their slots', () => {
  const dictionaries = {
    es: { 'Remove {0}': 'Quitar {0}', 'Taro Milk Tea': 'Té de taro', Pudding: 'Flan', '({0})': '({0})' },
  };
  assert.equal(lookupDictionary(dictionaries, 'es', 'Remove Taro Milk Tea'), 'Quitar Té de taro');
  assert.equal(lookupDictionary(dictionaries, 'es', 'Remove Unknown Drink'), 'Quitar Unknown Drink');
  assert.equal(lookupDictionary(dictionaries, 'es', ' (Pudding, Pudding)'), '(Flan, Flan)');
  assert.equal(lookupDictionary(dictionaries, 'es', 'Something else'), undefined);
});
