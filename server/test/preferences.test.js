import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isUuid } from '../src/utils/uuid.js';
import { PREFERENCES } from '../src/settings/preferences.js';
import { normalizePreferences } from '../src/utils/preferences.js';

test('isUuid only accepts UUIDs', () => {
  assert.equal(isUuid('3f2b8c1e-9d4a-4c6b-8e2f-1a2b3c4d5e6f'), true);
  assert.equal(isUuid('kiosk-1'), false);
  assert.equal(isUuid(undefined), false);
});

test('normalizePreferences fills defaults and drops unknown keys', () => {
  const settings = normalizePreferences({ contrast: 'high', secret: 'x' });
  assert.deepEqual(settings, { ...PREFERENCES.DEFAULTS, contrast: 'high' });
});

test('normalizePreferences accepts every supported value', () => {
  const settings = normalizePreferences({ contrast: 'high', textSize: 'largest', largeTargets: true, moreTime: true, reduceMotion: true });
  assert.equal(settings.textSize, 'largest');
  assert.equal(settings.moreTime, true);
});

test('normalizePreferences lists every invalid value', () => {
  assert.throws(
    () => normalizePreferences({ contrast: 'neon', textSize: 'huge', moreTime: 'yes' }),
    (error) => error.status === 400 && error.details.length === 3,
  );
  assert.throws(() => normalizePreferences(null), /Settings are required/);
});
