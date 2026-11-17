-- Sprint 2: Boba Spin game. One spin per player; a winning spin carries a single-use discount code.
CREATE TABLE IF NOT EXISTS game_spins (
  player_id uuid PRIMARY KEY,
  segment_id text NOT NULL,
  percent integer NOT NULL DEFAULT 0,
  code text UNIQUE,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  redeemed_at timestamptz,
  order_id integer
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount numeric(10, 2) NOT NULL DEFAULT 0;
