import { WEATHER } from '../settings/weather.js';
import { HttpError } from '../utils/httpError.js';
import { classifyWeather, pickDrinks } from '../utils/weatherMood.js';
import { listMenu } from './menuService.js';

let cached = null;

async function fetchOpenMeteo() {
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

// Fallback provider: US National Weather Service. Free, no key, but wants a User-Agent.
let nwsHourlyUrl = null;

async function nwsJson(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'reveille-brew-kiosk', Accept: 'application/geo+json' },
    signal: AbortSignal.timeout(WEATHER.REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new HttpError(502, 'Weather service is unavailable', { upstreamStatus: response.status });
  return response.json();
}

async function fetchNws() {
  if (!nwsHourlyUrl) {
    const point = await nwsJson(`${WEATHER.NWS_URL}/points/${WEATHER.LATITUDE},${WEATHER.LONGITUDE}`);
    nwsHourlyUrl = point.properties.forecastHourly;
  }
  const { properties } = await nwsJson(nwsHourlyUrl);
  const now = properties.periods[0];
  const text = now.shortForecast;
  // Map NWS wording onto the WMO codes the mood logic already understands.
  let weatherCode = 0;
  if (/snow|sleet|flurr|ice|freezing/i.test(text)) weatherCode = 73;
  else if (/rain|shower|storm|drizzle/i.test(text)) weatherCode = 63;
  const temperatureF = now.temperatureUnit === 'C' ? now.temperature * 1.8 + 32 : now.temperature;
  return { temperatureF: Math.round(temperatureF), weatherCode };
}

async function fetchCurrentWeather() {
  try {
    return await fetchOpenMeteo();
  } catch (primaryError) {
    console.error('Open-Meteo failed, trying NWS:', primaryError.message, primaryError.details ?? '');
    try {
      return await fetchNws();
    } catch (fallbackError) {
      console.error('NWS failed:', fallbackError.message, fallbackError.details ?? '');
      throw primaryError;
    }
  }
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
