// Settings for kiosk translation.
export const I18N = {
  LANGUAGE_STORAGE_KEY: 'reveille.language',
  PLAIN_STORAGE_KEY: 'reveille.plainLanguage',
  SOURCE_LANGUAGE: 'en',
  BATCH_DELAY_MS: 120,
  MAX_BATCH_SIZE: 50,
  MAX_TEXT_LENGTH: 400,
  MIN_TEXT_LENGTH: 2,
  // Text that is the same in every language (brand names and symbols).
  KEEP_AS_IS: ['Reveille Brew Co.', 'Boba Spin', 'A−', 'A+'],
  // Attributes that screen readers announce, so they are translated with the visible text.
  TRANSLATED_ATTRIBUTES: ['aria-label', 'placeholder', 'title', 'alt'],
  // Elements that are never translated. `translate="no"` is the standard way to opt out.
  SKIP_SELECTOR: '[translate="no"], [data-no-translate], script, style, textarea, input, [contenteditable="true"]',
};
