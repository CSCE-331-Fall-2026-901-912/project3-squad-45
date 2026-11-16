import { STORE_INFO } from '../../config/storeInfo';
import { VENDOR_NAME } from '../../config/constants';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="site-footer__brand" translate="no">{VENDOR_NAME}</p>
        <p>{STORE_INFO.ADDRESS}</p>
      </div>
      <div>
        <h2 className="site-footer__title">Hours</h2>
        <ul>
          {STORE_INFO.HOURS.map(({ days, time }) => <li key={days}><span>{days}</span> <span>{time}</span></li>)}
        </ul>
      </div>
      <div>
        <h2 className="site-footer__title">Need help?</h2>
        <p>Ask the assistant, change the language, or use the accessibility settings at the top of the page.</p>
      </div>
    </footer>
  );
}
