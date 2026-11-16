import { useContext } from 'react';
import { LanguageContext } from '../i18n/LanguageContext';

// Current language, plain-language mode and their setters. Page text is translated
// automatically, so most components never need this; only the language controls do.
export function useTranslate() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslate must be used inside a LanguageProvider');
  return context;
}
