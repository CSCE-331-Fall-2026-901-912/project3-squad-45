import { I18N } from '../config/i18n.js';

// Pure helpers for the DOM translator, kept separate so they can be unit tested.

// Only text that contains a letter and has a sensible length is worth translating.
export function isTranslatable(text) {
  const trimmed = text.trim();
  return trimmed.length >= I18N.MIN_TEXT_LENGTH
    && trimmed.length <= I18N.MAX_TEXT_LENGTH
    && /\p{L}/u.test(trimmed);
}

// Re-applies the original's leading and trailing whitespace to a translation.
export function matchWhitespace(original, translated) {
  const leading = original.match(/^\s*/)[0];
  const trailing = original.match(/\s*$/)[0];
  return `${leading}${translated.trim()}${trailing}`;
}

export function chunk(items, size) {
  const groups = [];
  for (let index = 0; index < items.length; index += size) groups.push(items.slice(index, index + size));
  return groups;
}

const PLACEHOLDER = /\{\d+\}/;
const templateCache = new WeakMap();

// Compiles the dictionary's templated keys (those with `{0}`-style slots) into regular expressions.
function templatesFor(dictionary) {
  if (!templateCache.has(dictionary)) {
    const templates = Object.keys(dictionary).filter((key) => PLACEHOLDER.test(key)).map((key) => ({
      key,
      pattern: new RegExp(`^${key.split(PLACEHOLDER).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.+?)')}$`),
    }));
    templateCache.set(dictionary, templates);
  }
  return templateCache.get(dictionary);
}

// Translates the value captured by a template slot: a known phrase, or a comma-separated list of them.
function translateCapture(dictionary, value) {
  if (dictionary[value] !== undefined) return dictionary[value];
  const parts = value.split(', ');
  return parts.length > 1 ? parts.map((part) => dictionary[part] ?? part).join(', ') : value;
}

// Looks up a built-in translation for interface text; undefined when there is none.
// Exact matches win; otherwise templates such as "Remove {0}" are tried and their slots translated.
export function lookupDictionary(dictionaries, language, text) {
  const dictionary = dictionaries[language];
  if (!dictionary) return undefined;
  const trimmed = text.trim();
  if (dictionary[trimmed] !== undefined) return dictionary[trimmed];
  for (const { key, pattern } of templatesFor(dictionary)) {
    const match = trimmed.match(pattern);
    if (match) return dictionary[key].replace(/\{(\d+)\}/g, (_, index) => translateCapture(dictionary, match[Number(index) + 1] ?? ''));
  }
  return undefined;
}
