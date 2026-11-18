import { fetchWeather } from '../../../api/weatherApi';
import { useApi } from '../../../hooks/useApi';
import DrinkCard from '../DrinkCard';
import '../weather.css';

const MOOD_ICONS = { rainy: '🌧️', cold: '🧣', hot: '☀️', mild: '🌤️' };

// Home page banner that suggests drinks for the current weather. Picked up by kioskSlots.
export default function WeatherSection({ onSelectProduct }) {
  const weather = useApi(fetchWeather);
  if (weather.loading) return null;
  if (weather.error || !weather.data) {
    return (
      <section className="weather weather--unavailable" aria-labelledby="weather-heading">
        <div className="weather__intro">
          <span className="weather__icon" aria-hidden="true">🌥️</span>
          <div>
            <h2 id="weather-heading" className="weather__title">Weather is not available right now.</h2>
            <p className="weather__note">
              <button type="button" className="weather__retry" onClick={weather.reload}>Try again</button>
            </p>
          </div>
        </div>
      </section>
    );
  }
  const { temperatureF, mood, headline, picks } = weather.data;

  return (
    <section className={`weather weather--${mood}`} aria-labelledby="weather-heading">
      <div className="weather__intro">
        <span className="weather__icon" aria-hidden="true">{MOOD_ICONS[mood]}</span>
        <div>
          <p className="eyebrow"><span translate="no">{temperatureF}°F</span> in College Station</p>
          <h2 id="weather-heading" className="weather__title">{headline}</h2>
        </div>
      </div>
      {picks.length > 0 && (
        <ul className="drink-grid">
          {picks.map((product) => (
            <li key={product.productId}><DrinkCard product={product} onSelect={onSelectProduct} /></li>
          ))}
        </ul>
      )}
    </section>
  );
}
