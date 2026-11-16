-- Sprint 2: anonymous per-device accessibility settings (no personal data is stored).
CREATE TABLE IF NOT EXISTS accessibility_preferences (
  device_id uuid PRIMARY KEY,
  settings jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
