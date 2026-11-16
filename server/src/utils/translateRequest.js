import { TRANSLATE } from '../settings/translate.js';
import { badRequest } from './httpError.js';

export const isSupportedLanguage = (code) => TRANSLATE.LANGUAGES.some((language) => language.code === code);

// Validates a translate request body and returns the cleaned { language, texts }.
export function parseTranslateRequest(body) {
  const { target, texts } = body ?? {};
  if (!isSupportedLanguage(target)) throw badRequest('Unsupported language');
  if (!Array.isArray(texts) || texts.length === 0) throw badRequest('Provide texts to translate');
  if (texts.length > TRANSLATE.MAX_TEXTS_PER_REQUEST) {
    throw badRequest(`At most ${TRANSLATE.MAX_TEXTS_PER_REQUEST} texts per request`);
  }
  if (!texts.every((text) => typeof text === 'string' && text.length <= TRANSLATE.MAX_TEXT_LENGTH)) {
    throw badRequest(`Each text must be a string of at most ${TRANSLATE.MAX_TEXT_LENGTH} characters`);
  }
  return { language: target, texts };
}
