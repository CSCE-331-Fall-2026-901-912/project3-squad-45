import { TRANSLATE } from '../settings/translate.js';

const HTML_ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" };

export const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The API returns HTML-escaped text because requests are sent as HTML.
export const decodeEntities = (text) =>
  text
    .replace(/&(?:amp|lt|gt|quot|apos|#39);/g, (entity) => HTML_ENTITIES[entity])
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Exact-phrase lookup (case-insensitive); returns undefined when the glossary has no entry.
export function glossaryLookup(text, language, glossary = TRANSLATE.GLOSSARY) {
  const translated = glossary[language]?.[text.trim().toLowerCase()];
  if (translated === undefined) return undefined;
  return text.trim()[0] === text.trim()[0]?.toUpperCase()
    ? translated.charAt(0).toUpperCase() + translated.slice(1)
    : translated;
}

// Wraps brand terms so the translation service leaves them untouched.
export function protectTerms(text, terms = TRANSLATE.PROTECTED_TERMS) {
  const ordered = [...terms].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(ordered.map(escapeRegExp).join('|'), 'g');
  return escapeHtml(text).replace(pattern, (term) => `<span class="notranslate">${term}</span>`);
}

// Removes the protective markup from a translated string and decodes entities.
export const unprotect = (html) => decodeEntities(html.replace(/<\/?span[^>]*>/g, ''));
