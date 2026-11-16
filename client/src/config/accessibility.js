// Settings for the accessibility toolbar. Keep the keys in sync with server/src/settings/preferences.js.
export const ACCESSIBILITY = {
  STORAGE_KEY: 'reveille.accessibility',
  DEVICE_ID_KEY: 'reveille.deviceId',
  SAVE_DELAY_MS: 600,
  // Scale applied to the kiosk's base font size (see --kiosk-text-scale).
  TEXT_SIZES: [
    { key: 'normal', label: 'Normal', scale: 1 },
    { key: 'large', label: 'Large', scale: 1.2 },
    { key: 'larger', label: 'Larger', scale: 1.4 },
    { key: 'largest', label: 'Largest', scale: 1.65 },
  ],
  // "More time" multiplies the idle timeout so slower users are not reset mid-order.
  MORE_TIME_FACTOR: 3,
  DEFAULTS: {
    contrast: 'normal',
    textSize: 'normal',
    largeTargets: false,
    moreTime: false,
    reduceMotion: false,
  },
};
