import { WEATHER } from '../settings/weather.js';

// Decides which mood a forecast calls for. Rain and snow beat temperature.
export function classifyWeather({ temperatureF, weatherCode }) {
  let mood = 'mild';
  if (WEATHER.RAIN_CODES.includes(weatherCode)) mood = 'rainy';
  else if (WEATHER.SNOW_CODES.includes(weatherCode) || temperatureF <= WEATHER.COLD_F) mood = 'cold';
  else if (temperatureF >= WEATHER.HOT_F) mood = 'hot';
  return { mood, ...WEATHER.MOODS[mood] };
}

// Picks the most popular available drinks from the mood's categories.
export function pickDrinks(products, categories, count = WEATHER.PICK_COUNT) {
  return products
    .filter((product) => categories.includes(product.category))
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0) || a.name.localeCompare(b.name))
    .slice(0, count);
}
