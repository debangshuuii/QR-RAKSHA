-- ============================================================================
-- TrailQR Raksha — Snowflake CoCo Data Pipeline & Threat Intelligence Schema
-- MLH Snowflake Track: Best Open-Source AI Project with Snowflake
-- Combines: Snowflake CoCo + Cybersyn Marketplace POI Dataset + Gemma 4 AI
--
-- Official Resources:
-- 1. Snowflake Cortex Code: https://signup.snowflake.com/cortex-code/
-- 2. Cortex Code Docs:     https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code
-- 3. Marketplace Listings:  https://docs.snowflake.com/en/collaboration/consumer-listings-exploring
-- 4. Sample Data Docs:      https://docs.snowflake.com/en/user-guide/sample-data
-- ============================================================================

CREATE DATABASE IF NOT EXISTS TRAILQR;
CREATE SCHEMA IF NOT EXISTS TRAILQR.REGISTRY;
USE SCHEMA TRAILQR.REGISTRY;

-- ----------------------------------------------------------------------------
-- 1. COMMUNITY AUDIT TELEMETRY TABLE (Zero-PII Privacy-Scrubbed Scans)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS TRAILQR.REGISTRY.QR_REGISTRY (
  qr_hash       STRING,       -- FNV-1a cryptographic hash (never raw payload)
  display_name  STRING,       -- Scanned merchant / payload title
  category      STRING,       -- upi | upi_merchant | url | wifi | text
  coarse_area   STRING,       -- Coarse neighborhood only (never exact GPS)
  verdict       STRING,       -- SAFE | CAUTION | DANGEROUS
  score         NUMBER,       -- Threat score (0 - 100)
  payee_masked  STRING,       -- Masked VPA (e.g. ch***@okhdfcbank)
  reported      BOOLEAN,      -- Flagged by street community as malicious
  created_at    TIMESTAMP_NTZ -- Audit timestamp
);

-- ----------------------------------------------------------------------------
-- 2. FREELY ACCESSIBLE DATASET: Cybersyn Point of Interest (POI) & Business Data
-- Sourced from Snowflake Marketplace: "Cybersyn: Point of Interest & Business"
-- In production, references: CYBERSYN.POIS_INDEX or local verified cache
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS TRAILQR.REGISTRY.CYBERSYN_VERIFIED_MERCHANTS (
  poi_id        STRING,
  merchant_name STRING,
  category      STRING,       -- Food & Dining | Education | Retail | Healthcare
  coarse_area   STRING,       -- Neighborhood in Kolkata / West Bengal
  city          STRING,
  state         STRING,
  pincode       STRING,
  verified_vpa  STRING,       -- Known authentic payment handle
  is_verified   BOOLEAN
);

-- Seed representative Kolkata business points of interest:
INSERT INTO TRAILQR.REGISTRY.CYBERSYN_VERIFIED_MERCHANTS
(poi_id, merchant_name, category, coarse_area, city, state, pincode, verified_vpa, is_verified)
VALUES
  ('POI_KOL_001', 'Chai Dukaan', 'Food & Dining', 'Rabindra Sarobar', 'Kolkata', 'West Bengal', '700029', 'chaidukaan@okhdfcbank', TRUE),
  ('POI_KOL_002', 'Techno Main Salt Lake', 'Education', 'Salt Lake Sector V', 'Kolkata', 'West Bengal', '700091', 'mab.037135003190033@axisbank', TRUE),
  ('POI_KOL_003', 'College Street Coffee House', 'Food & Dining', 'College Street', 'Kolkata', 'West Bengal', '700073', 'coffeehouse@sbi', TRUE),
  ('POI_KOL_004', 'Park Street Confectionery', 'Food & Dining', 'Park Street', 'Kolkata', 'West Bengal', '700016', 'parkstbakery@icici', TRUE),
  ('POI_KOL_005', 'Gariahat Market Handloom', 'Retail', 'Gariahat', 'Kolkata', 'West Bengal', '700019', 'gariahatsarees@hdfcbank', TRUE)
WHERE NOT EXISTS (SELECT 1 FROM TRAILQR.REGISTRY.CYBERSYN_VERIFIED_MERCHANTS WHERE poi_id = 'POI_KOL_001');

-- ----------------------------------------------------------------------------
-- 3. COCO PIPELINE VIEW 1: Neighborhood Fraud Hotspots
-- Written by Snowflake CoCo to aggregate threat density by locality
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW TRAILQR.REGISTRY.V_FRAUD_HOTSPOTS_BY_AREA AS
SELECT
  coarse_area,
  COUNT(*) AS total_scans,
  COUNT(CASE WHEN verdict = 'DANGEROUS' OR reported = TRUE THEN 1 END) AS threat_count,
  ROUND(100.0 * COUNT(CASE WHEN verdict = 'DANGEROUS' OR reported = TRUE THEN 1 END) / NULLIF(COUNT(*), 0), 1) AS fraud_rate_pct,
  ROUND(AVG(score), 1) AS avg_threat_score,
  MODE(category) AS predominant_attack_vector,
  MAX(created_at) AS latest_audit_time
FROM TRAILQR.REGISTRY.QR_REGISTRY
GROUP BY coarse_area
ORDER BY threat_count DESC, avg_threat_score DESC;

-- ----------------------------------------------------------------------------
-- 4. COCO PIPELINE VIEW 2: Sticker-Swap Anomaly Detection
-- Cross-references community audits with Cybersyn Marketplace POI dataset
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW TRAILQR.REGISTRY.V_STICKER_SWAP_ANOMALIES AS
SELECT
  r.qr_hash,
  r.display_name AS scanned_name,
  r.coarse_area,
  r.payee_masked AS actual_payee,
  c.merchant_name AS registered_merchant_name,
  c.verified_vpa AS registered_merchant_vpa,
  r.score AS threat_score,
  CASE
    WHEN c.merchant_name IS NULL THEN 'UNREGISTERED_ENTITY_IN_AREA'
    WHEN LOWER(r.display_name) != LOWER(c.merchant_name) THEN 'NAME_MISMATCH_SUSPECTED'
    WHEN r.reported = TRUE THEN 'COMMUNITY_REPORTED_STICKER_SWAP'
    ELSE 'VERIFIED_CLEAN_MERCHANT'
  END AS anomaly_classification
FROM TRAILQR.REGISTRY.QR_REGISTRY r
LEFT JOIN TRAILQR.REGISTRY.CYBERSYN_VERIFIED_MERCHANTS c
  ON LOWER(r.coarse_area) = LOWER(c.coarse_area)
  AND (LOWER(r.display_name) LIKE '%' || LOWER(c.merchant_name) || '%' 
       OR LOWER(c.merchant_name) LIKE '%' || LOWER(r.display_name) || '%');

-- ----------------------------------------------------------------------------
-- 5. COCO PIPELINE VIEW 3: Google Gemma AI Intelligence Feed
-- Structured analytical context consumed by Gemma 4 for localized debriefs
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW TRAILQR.REGISTRY.V_GEMMA_AI_NEIGHBOURHOOD_BRIEF AS
SELECT
  h.coarse_area,
  h.total_scans,
  h.threat_count,
  h.fraud_rate_pct,
  h.avg_threat_score,
  CASE
    WHEN h.fraud_rate_pct >= 50.0 THEN 'HIGH_RISK_CORRIDOR'
    WHEN h.fraud_rate_pct >= 20.0 THEN 'ELEVATED_CAUTION'
    ELSE 'GENERALLY_SAFE_COMMUNITY'
  END AS security_tier,
  COUNT(a.qr_hash) AS sticker_swap_incidents
FROM TRAILQR.REGISTRY.V_FRAUD_HOTSPOTS_BY_AREA h
LEFT JOIN TRAILQR.REGISTRY.V_STICKER_SWAP_ANOMALIES a
  ON h.coarse_area = a.coarse_area
  AND a.anomaly_classification IN ('COMMUNITY_REPORTED_STICKER_SWAP', 'NAME_MISMATCH_SUSPECTED')
GROUP BY h.coarse_area, h.total_scans, h.threat_count, h.fraud_rate_pct, h.avg_threat_score;

-- ----------------------------------------------------------------------------
-- 6. DATA INGESTION: File Format & COPY INTO pipeline
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FILE FORMAT TRAILQR.REGISTRY.CSV_FORMAT
  TYPE = 'CSV'
  FIELD_DELIMITER = ','
  SKIP_HEADER = 1
  FIELD_OPTIONALLY_ENCLOSED_BY = '"'
  NULL_IF = ('', 'NULL')
  TIMESTAMP_FORMAT = 'AUTO';

-- Example Stage & COPY INTO (automated via Snowpipe or manual upload):
-- CREATE OR REPLACE STAGE TRAILQR.REGISTRY.REGISTRY_STAGE FILE_FORMAT = TRAILQR.REGISTRY.CSV_FORMAT;
-- COPY INTO TRAILQR.REGISTRY.QR_REGISTRY
--   FROM @TRAILQR.REGISTRY.REGISTRY_STAGE/trailqr_registry.csv
--   ON_ERROR = 'CONTINUE';
