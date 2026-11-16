import { query } from '../db/pool.js';

export async function getPreferences(deviceId) {
  const [row] = await query('SELECT settings FROM accessibility_preferences WHERE device_id = $1', [deviceId]);
  return row?.settings ?? null;
}

export async function savePreferences(deviceId, settings) {
  const [row] = await query(
    `INSERT INTO accessibility_preferences (device_id, settings)
     VALUES ($1, $2)
     ON CONFLICT (device_id) DO UPDATE SET settings = EXCLUDED.settings, updated_at = now()
     RETURNING settings`,
    [deviceId, settings],
  );
  return row.settings;
}
