import { useTranslate } from '../../../hooks/useTranslate';
import '../../../i18n/language.css';

// Language picker and plain-language switch for the kiosk header.
export default function LanguageTool() {
  const { language, setLanguage, plain, setPlain, languages, status } = useTranslate();
  if (languages.length === 0) return null;
  const untranslated = language !== 'en' && status.error;

  return (
    <div className="language-tool">
      {/* Fixed bilingual label so a customer can find the picker in any language. */}
      <label className="language-tool__picker" translate="no">
        <span aria-hidden="true">🌐</span>
        <span className="visually-hidden">Language / Idioma</span>
        <select value={language} onChange={(event) => setLanguage(event.target.value)}>
          {languages.map(({ code, label }) => <option key={code} value={code}>{label}</option>)}
        </select>
      </label>
      <button type="button" aria-pressed={plain} onClick={() => setPlain((on) => !on)}>Simple words</button>
      <span className="visually-hidden" role="status">
        {status.busy ? 'Translating…' : ''}
        {untranslated ? 'Some text could not be translated.' : ''}
      </span>
      {untranslated && (
        <span className="language-tool__warning" role="note">Some text is not translated</span>
      )}
    </div>
  );
}
