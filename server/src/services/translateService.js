import { createHash } from 'node:crypto';
import { TRANSLATE } from '../settings/translate.js';
import { query } from '../db/pool.js';
import { HttpError } from '../utils/httpError.js';
import { glossaryLookup, protectTerms, unprotect } from '../utils/glossary.js';

export const translationEnabled = () => Boolean(TRANSLATE.API_KEY);

const hashText = (text) => createHash('md5').update(text).digest('hex');

async function readCache(language, texts) {
  const rows = await query(
    `SELECT source_hash, translated_text FROM translation_cache
      WHERE target_lang = $1 AND source_hash = ANY($2)`,
    [language, texts.map(hashText)],
  );
  return new Map(rows.map((row) => [row.source_hash, row.translated_text]));
}

async function writeCache(language, pairs) {
  if (!pairs.length) return;
  await query(
    `INSERT INTO translation_cache (target_lang, source_hash, source_text, translated_text)
     SELECT $1, hash, source, translated
       FROM unnest($2::text[], $3::text[], $4::text[]) AS t(hash, source, translated)
     ON CONFLICT DO NOTHING`,
    [language, pairs.map(([text]) => hashText(text)), pairs.map(([text]) => text), pairs.map(([, translated]) => translated)],
  );
}

async function callTranslateApi(language, texts) {
  const response = await fetch(`${TRANSLATE.API_URL}?key=${encodeURIComponent(TRANSLATE.API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: texts.map((text) => protectTerms(text)),
      source: TRANSLATE.SOURCE_LANGUAGE,
      target: language,
      format: 'html',
    }),
    signal: AbortSignal.timeout(TRANSLATE.REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new HttpError(502, 'Translation service is unavailable');
  const body = await response.json();
  return body.data.translations.map((entry) => unprotect(entry.translatedText));
}

// Translates each text: glossary first, then the cache, then the API for what is left.
export async function translateTexts(language, texts) {
  const result = new Array(texts.length);
  const pending = [];

  texts.forEach((text, index) => {
    const known = glossaryLookup(text, language);
    if (known === undefined) pending.push(index);
    else result[index] = known;
  });
  if (!pending.length) return result;

  const cached = await readCache(language, pending.map((index) => texts[index]));
  const missing = [];
  for (const index of pending) {
    const hit = cached.get(hashText(texts[index]));
    if (hit === undefined) missing.push(index);
    else result[index] = hit;
  }
  if (!missing.length) return result;

  if (!translationEnabled()) throw new HttpError(503, 'Translation is not configured');
  const unique = [...new Set(missing.map((index) => texts[index]))];
  const translated = await callTranslateApi(language, unique);
  const byText = new Map(unique.map((text, i) => [text, translated[i]]));
  await writeCache(language, [...byText.entries()]);
  for (const index of missing) result[index] = byText.get(texts[index]);
  return result;
}
