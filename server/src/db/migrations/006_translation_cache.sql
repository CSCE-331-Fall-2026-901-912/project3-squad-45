-- Sprint 2: cache of machine translations so each phrase is only paid for once.
CREATE TABLE IF NOT EXISTS translation_cache (
  target_lang text NOT NULL,
  source_hash char(32) NOT NULL,
  source_text text NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (target_lang, source_hash)
);
