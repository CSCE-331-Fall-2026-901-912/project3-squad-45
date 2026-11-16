import { http } from './http';

export const fetchWeather = () => http('/api/weather');
