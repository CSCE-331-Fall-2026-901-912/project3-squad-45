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

// Looks up a built-in translation for interface text; undefined when there is none.
export const lookupDictionary = (dictionaries, language, text) => dictionaries[language]?.[text.trim()];
