import { http } from './http';

export const fetchPreferences = (deviceId) => http(`/api/preferences/${deviceId}`).then((data) => data.settings);
export const savePreferences = (deviceId, settings) =>
  http(`/api/preferences/${deviceId}`, { method: 'PUT', body: { settings } });
