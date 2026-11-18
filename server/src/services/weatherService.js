import { WEATHER } from '../settings/weather.js';
import { HttpError } from '../utils/httpError.js';
import { classifyWeather, pickDrinks } from '../utils/weatherMood.js';
import { listMenu } from './menuService.js';

let cached = null;

async function fetchCurrentWeather() {
  const params = new URLSearchParams({
    latitude: WEATHER.LATITUDE,
    longitude: WEATHER.LONGITUDE,
    current: 'temperature_2m,weather_code',
    temperature_unit: 'fahrenheit',
  });
  let response;
  try {
    response = await fetch(`${WEATHER.API_URL}?${params}`, {
      signal: AbortSignal.timeout(WEATHER.REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new HttpError(502, 'Weather service is unavailable', { reason: error.message });
  }
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new HttpError(502, 'Weather service is unavailable', {
      upstreamStatus: response.status,
      body: body.slice(0, 200),
    });
  }
  const { current } = await response.json();
  return { temperatureF: Math.round(current.temperature_2m), weatherCode: current.weather_code };
}

// Shared by every kiosk, so the forecast is fetched at most once per cache window.
export async function getWeather(now = Date.now()) {
  if (!cached || now - cached.fetchedAt > WEATHER.CACHE_TTL_MS) {
    try {
      cached = { ...(await fetchCurrentWeather()), fetchedAt: now };
    } catch (error) {
      // Keep serving the last good reading during an outage; only fail if we never had one.
      console.error('Weather refresh failed:', error.message, error.details ?? '');
      if (!cached) throw error;
      cached = { ...cached, fetchedAt: now - WEATHER.CACHE_TTL_MS + 60_000 }; // retry in ~1 min
    }
  }
  const mood = classifyWeather(cached);
  const picks = pickDrinks(await listMenu(), mood.categories);
  return { temperatureF: cached.temperatureF, mood: mood.mood, headline: mood.headline, picks };
}
