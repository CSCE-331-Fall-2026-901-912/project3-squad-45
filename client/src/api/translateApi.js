import { http } from './http';

export const fetchLanguages = () => http('/api/translate/languages');
export const translateTexts = (target, texts) =>
  http('/api/translate', { method: 'POST', body: { target, texts } }).then((data) => data.translations);
