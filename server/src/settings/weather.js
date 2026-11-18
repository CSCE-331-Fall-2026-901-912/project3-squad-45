// Weather settings. The shop is in College Station, TX.
export const WEATHER = {
  API_URL: 'https://api.open-meteo.com/v1/forecast',
  NWS_URL: 'https://api.weather.gov',
  LATITUDE: 30.628,
  LONGITUDE: -96.3344,
  REQUEST_TIMEOUT_MS: 5_000,
  CACHE_TTL_MS: 10 * 60 * 1000,
  HOT_F: 88,
  COLD_F: 55,
  PICK_COUNT: 4,
  // WMO weather codes grouped by what they mean for a drink recommendation.
  RAIN_CODES: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99],
  SNOW_CODES: [71, 73, 75, 77, 85, 86],
  // Menu categories to feature for each mood.
  MOODS: {
    rainy: { headline: 'Rainy day? Warm up with a cozy milk tea.', categories: ['Milk Tea', 'Specialty'] },
    cold: { headline: 'Chilly out there. Try something creamy and comforting.', categories: ['Milk Tea', 'Specialty'] },
    hot: { headline: 'It is hot in Aggieland. Cool off with something icy.', categories: ['Slush', 'Fruit Tea'] },
    mild: { headline: 'Perfect weather for a fresh, classic tea.', categories: ['Classic Tea', 'Fruit Tea'] },
  },
};
