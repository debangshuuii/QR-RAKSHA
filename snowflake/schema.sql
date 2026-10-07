-- TrailQR Raksha — Snowflake registry (scrubbed rows ONLY)
-- Columns match js/registry.js exactly, so an exported CSV loads unchanged.
-- Trial setup: run in a Snowflake worksheet. No card details are stored here.

CREATE DATABASE IF NOT EXISTS TRAILQR;
CREATE SCHEMA IF NOT EXISTS TRAILQR.REGISTRY;

CREATE TABLE IF NOT EXISTS TRAILQR.REGISTRY.QR_REGISTRY (
  qr_hash       STRING,       -- hash of payload, never the payload itself
  display_name  STRING,       -- name encoded in the QR (e.g. shop name)
  category      STRING,       -- upi | url | wifi | text
  coarse_area   STRING,       -- neighbourhood only, never exact GPS
  verdict       STRING,       -- SAFE | CAUTION | DANGEROUS
  score         NUMBER,
  payee_masked  STRING,       -- e.g. ch***@okhdfcbank
  reported      BOOLEAN,
  created_at    TIMESTAMP_NTZ
);

-- Load the app's CSV export (Registry tab -> Export CSV for Snowflake):
--   1. In Snowsight: Data > Add Data > Load into table QR_REGISTRY, pick the CSV, file format CSV, header ON.
--   2. Or use a stage + COPY INTO once the file is uploaded.

-- Example analysis queries (also good CoCo follow-ups):
-- Dangerous finds by area:
--   SELECT coarse_area, COUNT(*) AS dangerous_count
--   FROM TRAILQR.REGISTRY.QR_REGISTRY
--   WHERE verdict = 'DANGEROUS' GROUP BY coarse_area ORDER BY dangerous_count DESC;
--
-- Reported QRs still marked SAFE by rules (false-negative hunt):
--   SELECT * FROM TRAILQR.REGISTRY.QR_REGISTRY WHERE reported = TRUE AND verdict = 'SAFE';
