import assert from 'node:assert/strict';
import { test } from 'node:test';
import { UI_DICTIONARY } from './uiDictionary.js';

const slots = (text) => (text.match(/\{\d+\}/g) ?? []).sort().join();
const languages = Object.keys(UI_DICTIONARY);
const english = Object.keys(UI_DICTIONARY.es);

test('every language translates the same English strings', () => {
  assert.deepEqual(languages.sort(), ['es', 'hi', 'ko', 'zh-CN']);
  for (const language of languages) {
    const keys = Object.keys(UI_DICTIONARY[language]);
    assert.deepEqual(english.filter((key) => !keys.includes(key)), [], `${language} is missing strings`);
    assert.deepEqual(keys.filter((key) => !english.includes(key)), [], `${language} has extra strings`);
  }
});

test('translations are not empty and keep the same {0} slots as the English text', () => {
  for (const language of languages) {
    for (const [source, translated] of Object.entries(UI_DICTIONARY[language])) {
      assert.ok(translated.trim(), `${language}: "${source}" is empty`);
      assert.equal(slots(translated), slots(source), `${language}: slots differ in "${source}"`);
    }
  }
});
