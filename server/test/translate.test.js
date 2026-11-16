import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decodeEntities, glossaryLookup, protectTerms, unprotect } from '../src/utils/glossary.js';
import { parseTranslateRequest } from '../src/utils/translateRequest.js';
import { TRANSLATE } from '../src/settings/translate.js';

test('glossary returns fixed boba translations and keeps capitalization', () => {
  assert.equal(glossaryLookup('Tapioca Pearls', 'es'), 'Perlas de tapioca');
  assert.equal(glossaryLookup('less ice', 'es'), 'poco hielo');
  assert.equal(glossaryLookup('Thank you', 'es'), undefined);
  assert.equal(glossaryLookup('Milk Tea', 'fr'), undefined);
});

test('protectTerms wraps brand names and escapes markup', () => {
  assert.equal(
    protectTerms('Welcome to Reveille Brew Co. <b>'),
    'Welcome to <span class="notranslate">Reveille Brew Co.</span> &lt;b&gt;',
  );
});

test('unprotect strips markup and decodes entities', () => {
  assert.equal(unprotect('Bienvenido a <span class="notranslate">Reveille</span> &amp; amigos &#39;hola&#39;'),
    "Bienvenido a Reveille & amigos 'hola'");
  assert.equal(decodeEntities('&#233;'), 'é');
});

test('parseTranslateRequest accepts a valid request', () => {
  assert.deepEqual(parseTranslateRequest({ target: 'es', texts: ['Hello'] }), { language: 'es', texts: ['Hello'] });
});

test('parseTranslateRequest rejects bad languages, empty and oversized requests', () => {
  assert.throws(() => parseTranslateRequest({ target: 'xx', texts: ['Hi'] }), /Unsupported language/);
  assert.throws(() => parseTranslateRequest({ target: 'es', texts: [] }), /Provide texts/);
  assert.throws(() => parseTranslateRequest({ target: 'es', texts: [1] }), /Each text/);
  const tooMany = Array(TRANSLATE.MAX_TEXTS_PER_REQUEST + 1).fill('a');
  assert.throws(() => parseTranslateRequest({ target: 'es', texts: tooMany }), /At most/);
});
