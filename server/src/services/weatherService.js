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
  const response = await fetch(`${WEATHER.API_URL}?${params}`, {
    signal: AbortSignal.timeout(WEATHER.REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new HttpError(502, 'Weather service is unavailable');
  const { current } = await response.json();
  return { temperatureF: Math.round(current.temperature_2m), weatherCode: current.weather_code };
}

// Shared by every kiosk, so the forecast is fetched at most once per cache window.
export async function getWeather(now = Date.now()) {
  if (!cached || now - cached.fetchedAt > WEATHER.CACHE_TTL_MS) {
    cached = { ...(await fetchCurrentWeather()), fetchedAt: now };
  }
  const mood = classifyWeather(cached);
  const picks = pickDrinks(await listMenu(), mood.categories);
  return { temperatureF: cached.temperatureF, mood: mood.mood, headline: mood.headline, picks };
}
