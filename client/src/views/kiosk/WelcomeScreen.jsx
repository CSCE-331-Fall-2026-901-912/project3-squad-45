import { VENDOR_NAME } from '../../config/constants';
import { STORE_INFO } from '../../config/storeInfo';
import DrinkArt from './DrinkArt';

// Attract screen shown until someone touches the kiosk.
export default function WelcomeScreen({ onStart }) {
  return (
    <button type="button" className="welcome" onClick={onStart}>
      <DrinkArt category="Fruit Tea" className="welcome__art" />
      <h1 className="welcome__title" translate="no">{VENDOR_NAME}</h1>
      <p className="welcome__sub">{STORE_INFO.TAGLINE} Howdy!</p>
      <span className="welcome__cta">Touch to start</span>
    </button>
  );
}
