import 'dotenv/config';
// Settings for the machine translation proxy.
export const TRANSLATE = {
  API_URL: 'https://translation.googleapis.com/language/translate/v2',
  API_KEY: process.env.GOOGLE_TRANSLATE_API_KEY || '',
  SOURCE_LANGUAGE: 'en',
  REQUEST_TIMEOUT_MS: 8_000,
  MAX_TEXTS_PER_REQUEST: 60,
  MAX_TEXT_LENGTH: 400,
  LANGUAGES: [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'zh-CN', label: '中文' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'hi', label: 'हिन्दी' },
  ],
  // Brand and drink names that must never be translated.
  PROTECTED_TERMS: ['Reveille Brew Co.', 'Reveille', 'Aggie', 'Aggieland', 'Gig \'em', 'Boba Spin'],
  // Fixed translations for boba vocabulary, so a word is translated the same way everywhere.
  GLOSSARY: {
    es: {
      'tapioca pearls': 'perlas de tapioca',
      'boba': 'boba',
      'milk tea': 'té con leche',
      'brown sugar': 'azúcar morena',
      'lychee jelly': 'gelatina de lichi',
      'red bean': 'frijol rojo',
      'honey jelly': 'gelatina de miel',
      'pudding': 'flan',
      'slush': 'granizado',
      'less ice': 'poco hielo',
      'extra ice': 'más hielo',
      'no ice': 'sin hielo',
    },
    vi: {
      'tapioca pearls': 'trân châu',
      'boba': 'trân châu',
      'milk tea': 'trà sữa',
      'slush': 'đá xay',
    },
  },
};
