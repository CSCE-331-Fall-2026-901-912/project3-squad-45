import { GAME } from '../settings/game.js';
import { query } from '../db/pool.js';
import { badRequest, HttpError } from '../utils/httpError.js';
import { generateCode, pickSegment } from '../utils/wheel.js';

const SPIN_COLUMNS = `segment_id AS "segmentId", percent, code, expires_at AS "expiresAt"`;

// One spin per player. Asking again returns the original result.
export async function spin(playerId, ip) {
  const [existing] = await query(`SELECT ${SPIN_COLUMNS} FROM game_spins WHERE player_id = $1`, [playerId]);
  if (existing) return { ...existing, repeat: true };

  const [{ count }] = await query(
    `SELECT COUNT(*) AS count FROM game_spins WHERE ip = $1 AND created_at > now() - interval '1 hour'`,
    [ip],
  );
  if (count >= GAME.MAX_SPINS_PER_IP_PER_HOUR) throw new HttpError(429, 'Too many spins. Please try again later.');

  const segment = pickSegment();
  const code = segment.percent > 0 ? generateCode() : null;
  const [created] = await query(
    `INSERT INTO game_spins (player_id, segment_id, percent, code, ip, expires_at)
     VALUES ($1, $2, $3, $4, $5, CASE WHEN $4::text IS NULL THEN NULL ELSE now() + make_interval(mins => $6) END)
     ON CONFLICT (player_id) DO NOTHING
     RETURNING ${SPIN_COLUMNS}`,
    [playerId, segment.id, segment.percent, code, ip, GAME.CODE_TTL_MINUTES],
  );
  return created ? { ...created, repeat: false } : spin(playerId, ip);
}

// Checks a code without using it; throws when it cannot be applied.
export async function lookupCode(code) {
  const [row] = await query(
    `SELECT percent, expires_at AS "expiresAt" FROM game_spins
      WHERE code = $1 AND redeemed_at IS NULL AND expires_at > now()`,
    [code],
  );
  if (!row) throw badRequest('Discount code is invalid, expired or already used');
  return row;
}

// Marks a code as used inside the order's transaction so a failed order never burns it.
export async function claimDiscount(client, code) {
  const { rows: [row] } = await client.query(
    `UPDATE game_spins SET redeemed_at = now()
      WHERE code = $1 AND redeemed_at IS NULL AND expires_at > now()
      RETURNING percent`,
    [code],
  );
  if (!row) throw badRequest('Discount code is invalid, expired or already used');
  return row.percent;
}

export const attachOrderToCode = (client, code, orderId) =>
  client.query('UPDATE game_spins SET order_id = $2 WHERE code = $1', [code, orderId]);
