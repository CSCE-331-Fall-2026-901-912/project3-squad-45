import { createContext, useEffect, useMemo, useState } from 'react';
import { fetchLanguages, translateTexts } from '../api/translateApi';
import { I18N } from '../config/i18n';
import { DomTranslator } from './DomTranslator';
import { UI_DICTIONARY } from './uiDictionary';

export const LanguageContext = createContext(null);

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function store(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Private browsing can block storage; the choice then lasts for this visit only.
  }
}

// Holds the chosen language and plain-language mode, and runs the page translator.
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => readStored(I18N.LANGUAGE_STORAGE_KEY, I18N.SOURCE_LANGUAGE));
  const [plain, setPlain] = useState(() => readStored(I18N.PLAIN_STORAGE_KEY, 'false') === 'true');
  const [languages, setLanguages] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState({ busy: false, error: false });
  const [translator, setTranslator] = useState(null);

  useEffect(() => {
    fetchLanguages()
      .then((data) => { setLanguages(data.languages); setEnabled(data.enabled); })
      .catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    const instance = new DomTranslator({
      root: document.body,
      fetchTranslations: translateTexts,
      dictionaries: UI_DICTIONARY,
      onStatus: setStatus,
    });
    instance.start();
    setTranslator(instance);
    return () => {
      instance.stop();
      document.documentElement.lang = I18N.SOURCE_LANGUAGE;
    };
  }, []);

  useEffect(() => {
    translator?.configure({ language, plain });
    document.documentElement.lang = language;
    store(I18N.LANGUAGE_STORAGE_KEY, language);
    store(I18N.PLAIN_STORAGE_KEY, String(plain));
  }, [translator, language, plain]);

  const value = useMemo(
    () => ({ language, setLanguage, plain, setPlain, languages, enabled, status }),
    [language, plain, languages, enabled, status],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
