import { PREFERENCES } from '../settings/preferences.js';
import { badRequest } from './httpError.js';

const BOOLEAN_KEYS = ['largeTargets', 'moreTime', 'reduceMotion'];

// Returns a complete, validated settings object; unknown keys are dropped and bad values throw a 400.
export function normalizePreferences(input) {
  if (!input || typeof input !== 'object') throw badRequest('Settings are required');
  const settings = { ...PREFERENCES.DEFAULTS };
  const errors = [];

  if (input.contrast !== undefined) {
    if (PREFERENCES.CONTRAST_MODES.includes(input.contrast)) settings.contrast = input.contrast;
    else errors.push('contrast must be normal or high');
  }
  if (input.textSize !== undefined) {
    if (PREFERENCES.TEXT_SIZES.includes(input.textSize)) settings.textSize = input.textSize;
    else errors.push(`textSize must be one of ${PREFERENCES.TEXT_SIZES.join(', ')}`);
  }
  for (const key of BOOLEAN_KEYS) {
    if (input[key] === undefined) continue;
    if (typeof input[key] === 'boolean') settings[key] = input[key];
    else errors.push(`${key} must be true or false`);
  }
  if (errors.length) throw badRequest('Invalid settings', errors);
  return settings;
}
