# Snowflake Cortex Code (CoCo) & Dataset Integration Guide

> **MLH Challenge Category:** Best Open-Source AI Project with Snowflake  
> **Project:** [TrailQR Raksha](https://github.com/debangshuuii/QR-RAKSHA) — Offline-First Street QR Fraud Defense  
> **Eligible Elements Combined:**  
> 1. ❄️ **Snowflake CoCo (Cortex Code):** AI coding agent for discovery, schema analysis, query generation, and data pipelines  
> 2. 🌐 **Freely Accessible Snowflake Dataset:** *Cybersyn: Point of Interest & Business Open Data* (Snowflake Marketplace) + *SNOWFLAKE_SAMPLE_DATA*  
> 3. 🤖 **Open-Source & Open-Weight AI:** *Google Gemma 4* (vernacular risk debriefs) + MIT-licensed TrailQR Raksha codebase

---

## 📚 Official Snowflake Resources Utilized

This project adheres directly to official Snowflake tooling and guidelines:
- **Snowflake Cortex Code:** [https://signup.snowflake.com/cortex-code/](https://signup.snowflake.com/cortex-code/) & [Documentation](https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code)
- **Snowflake Marketplace Consumer Listings:** [Exploring Listings Guide](https://docs.snowflake.com/en/collaboration/consumer-listings-exploring)
- **Snowflake Sample Datasets:** [Sample Data Guide](https://docs.snowflake.com/en/user-guide/sample-data)

---

## 🎯 Architecture: How the Three Pillars Connect

```
+-------------------------------------------------------------------------+
|                        1. THE STREET AUDIT                              |
| Physical QR on Kolkata street (tea stall, bookstore, taxi stand)       |
|    |                                                                    |
|    v                                                                    |
| Local Deterministic Rule Engine (js/rules.js)                           |
| Decodes payload locally -> Evaluates 14 red-flag heuristics             |
| Zero-PII Scrubbing: FNV-1a hash, coarse area, masked payee handle       |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|             2. SNOWFLAKE CoCo PIPELINE & MARKETPLACE DATASET            |
|                                                                         |
|  Freely Accessible Dataset: Cybersyn Point of Interest (POI) & Business |
|                                                                         |
|  Snowflake CoCo Generated Pipeline (schema.sql):                        |
|  - QR_REGISTRY: Scrubbed community audit telemetry                      |
|  - V_FRAUD_HOTSPOTS_BY_AREA: Neighborhood threat density & fraud rate   |
|  - V_STICKER_SWAP_ANOMALIES: Cross-references community scans with      |
|    Cybersyn POI to detect sticker-swap payee mismatches                 |
|  - V_GEMMA_AI_NEIGHBOURHOOD_BRIEF: Aggregated corridor risk feed        |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                  3. OPEN-WEIGHT AI: GOOGLE GEMMA 4                      |
|                                                                         |
| Consumes V_GEMMA_AI_NEIGHBOURHOOD_BRIEF security tiers                  |
| Generates localized, vernacular English & Bengali threat debriefs       |
| ("বিপদ — এই QR ব্যবহার করবেন না...") and civic exploration quests        |
+-------------------------------------------------------------------------+
```

---

## 💬 The Snowflake CoCo (Cortex Code) Journey: Step-by-Step

Snowflake Cortex Code (CoCo) was engaged across four key development phases:

### Phase 1: Discovering Freely Accessible Datasets
**Goal:** Find an authentic, freely accessible dataset in Snowflake Marketplace to cross-reference Indian street merchant QR codes and catch malicious sticker-swaps.

* **User Prompt to CoCo:**
  > *"I am building TrailQR Raksha, an open-source cybersecurity app that protects consumers from UPI QR sticker swaps in India (where scammers paste fake QR codes over authentic shop counters). I need a freely accessible dataset in Snowflake Marketplace or Snowflake Sample Data that contains business names, points of interest, or places so I can verify whether a scanned merchant is legitimate."*

* **CoCo Response & Recommendation:**
  > *"For point-of-interest and business verification without licensing costs, you can use the freely accessible **Cybersyn: Point of Interest & Business** dataset available on the Snowflake Marketplace. It contains normalized business entities, merchant categories, and geographical locations. Additionally, Snowflake accounts include `SNOWFLAKE_SAMPLE_DATA` (such as TPCDS/TPCH) for benchmarking. For your fraud detection use-case, joining your community scan logs against Cybersyn POI records by locality and merchant name is the recommended pattern."*

---

### Phase 2: Schema Exploration & Understanding
**Goal:** Understand the POI structure and design a privacy-preserving staging table.

* **User Prompt to CoCo:**
  > *"Show me how to inspect the Cybersyn POI structure and write DDL for a privacy-scrubbed telemetry table that stores street QR scans without leaking PII (no raw URLs, no full bank account numbers, no GPS coordinates)."*

* **CoCo Generated SQL:**
```sql
-- Generated by Snowflake CoCo for TrailQR Raksha
CREATE OR REPLACE TABLE TRAILQR.REGISTRY.QR_REGISTRY (
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
```

---

### Phase 3: Building the Threat Intelligence Views
**Goal:** Create automated views to detect fraud clusters and cross-reference Cybersyn verified merchants.

* **User Prompt to CoCo:**
  > *"Write two analytics views in Snowflake:
  > 1. `V_FRAUD_HOTSPOTS_BY_AREA` to calculate the percentage of dangerous QRs by neighbourhood.
  > 2. `V_STICKER_SWAP_ANOMALIES` that performs a fuzzy join between our scanned merchant names in `QR_REGISTRY` and `CYBERSYN_VERIFIED_MERCHANTS` to flag sticker swaps (where a QR has a high threat score or different payee while claiming to be an authentic shop)."*

* **CoCo Generated Views:**
```sql
-- 1. Neighborhood Fraud Hotspots View
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

-- 2. Sticker-Swap Anomaly Detection View
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
```

---

### Phase 4: Connecting Snowflake to Google Gemma 4 (Open-Weight AI)
**Goal:** Produce a consolidated threat context table that open-weight AI can digest to summarize neighborhood risks in local languages (English + Bengali).

* **User Prompt to CoCo:**
  > *"Create a Snowflake view `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF` that packages the fraud rates and sticker-swap counts into security tiers (HIGH_RISK_CORRIDOR, ELEVATED_CAUTION, GENERALLY_SAFE_COMMUNITY). This output will be passed as context to our Google Gemma 4 model."*

* **CoCo Generated View:**
```sql
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
```

---

## 🛡️ Zero-PII Privacy Guarantee

Our integration guarantees user privacy by construction:
| Field Collected | Stored in Snowflake? | Purpose / Privacy Protection |
| :--- | :---: | :--- |
| Raw QR Payload (URL / VPA string) | ❌ **NEVER** | Converted to one-way **FNV-1a hash** (`a1b2c3d4e5f60718`) |
| Exact GPS Coordinates / Street Address | ❌ **NEVER** | Replaced with coarse neighborhood only (`Rabindra Sarobar`) |
| Bank Account / Full VPA | ❌ **NEVER** | Cryptographically masked before persistence (`ch***@okhdfcbank`) |
| Transaction Amount | ❌ **NEVER** | Stripped completely; only scam score (0–100) is stored |

---

## 🚀 How to Run and Evaluate

### Option 1: Live in Snowflake Snowsight
1. Log into your Snowflake account ([snowflake.com](https://signup.snowflake.com/cortex-code/)).
2. Open a SQL Worksheet in Snowsight.
3. Paste and run [`snowflake/schema.sql`](schema.sql).
4. Run the pipeline queries:
   ```sql
   SELECT * FROM TRAILQR.REGISTRY.V_FRAUD_HOTSPOTS_BY_AREA;
   SELECT * FROM TRAILQR.REGISTRY.V_STICKER_SWAP_ANOMALIES;
   SELECT * FROM TRAILQR.REGISTRY.V_GEMMA_AI_NEIGHBOURHOOD_BRIEF;
   ```

### Option 2: Automated Local Pipeline (Node.js & Python)
Run the offline-capable pipeline emulator directly in your terminal:
```bash
# Via Node.js
node snowflake/pipeline.js

# Or via Python
python snowflake/pipeline.py
```
Both scripts will:
- Export the telemetry CSV (`snowflake/trailqr_registry.csv`).
- Compute `V_FRAUD_HOTSPOTS_BY_AREA` analytics.
- Cross-reference with the Cybersyn POI database to flag sticker swaps.
- Format the feed for Gemma 4.

### Option 3: Interactive UI Demonstration
1. Open [`index.html`](../index.html) in your browser.
2. Scroll to **Section 03: Community Registry**.
3. Click **"📥 Load Demo Street Telemetry"** to populate realistic Kolkata scans.
4. Click **"❄️ Snowflake CoCo Intelligence"** to view live aggregated hotspot statistics, sticker-swap classifications, and copy CoCo's SQL.
