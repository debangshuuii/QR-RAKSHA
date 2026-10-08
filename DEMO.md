# 3-Minute Demo & Presentation Script

## 🎤 Part 1: The Problem & Solution Pitch (50s)

* **Problem (30s):**  
  *"Kolkata runs on QR codes. Tea stalls, bookstores, taxi stands, campus counters: you scan, you pay, you move on. But you cannot see what is inside a 2D matrix before scanning. One fake sticker pasted over a shop's real QR and your money goes straight to a scammer. Or a fake 'KYC Update' QR takes you to a credential phishing site."*

* **Solution (20s):**  
  *"TrailQR Raksha checks a QR before you pay. Deterministic rules decide. Google Gemma 4 explains in English and vernacular Bengali. Zero sensitive data leaves your phone unsanitised. And Snowflake CoCo aggregates neighborhood threat patterns."*

---

## 📱 Part 2: Interactive Live Demo (100s)

1. **Safe Shop Demonstration:**
   - Click **"Safe shop UPI"** ➔ `SAFE 0/100`. Payee matches shop sign, official MCC verified, safe Bengali quest unlocks.
2. **Sticker-Swap Attack Demonstration:**
   - Click **"Sticker-swap UPI"** ➔ `DANGEROUS 75/100`.
   - Show how the rule engine catches: shop sign mismatch, personal VPA handle, pre-filled amount.
   - Show **Gemma 4 Bengali explanation**: *"বিপদ — এই QR ব্যবহার করবেন না..."*
   - Click **"Report this QR Fraud"** ➔ scrubbed hash and coarse area added to local registry.
3. **Phishing QR Demonstration:**
   - Click **"Phishing link QR"** ➔ `DANGEROUS 100/100` (insecure HTTP, spoofed Russian domain, urgency keywords).
4. **Snowflake CoCo Intelligence (The Snowflake Track Winner Demo):**
   - Scroll to **Section 03** ➔ Click **"📥 Load Demo Street Telemetry"** (populates 5 Kolkata audits).
   - Switch to **"❄️ Snowflake CoCo Intelligence"** tab:
     - Show **Neighborhood Hotspots**: Rabindra Sarobar (50% fraud rate), Park Street (100% fraud rate).
     - Show **Sticker-Swap Anomalies**: Cybersyn Marketplace POI cross-reference catches the sticker-swap on `Chai Dukaan`.
     - Show **CoCo SQL DDL**: The exact views Snowflake CoCo generated.

---

## ❄️ Part 3: Snowflake Judging Questions (When Judges Ask)

* **If asked to identify the dataset:**
  *"We used the freely accessible **Cybersyn: Point of Interest & Business Open Data** from Snowflake Marketplace, alongside `SNOWFLAKE_SAMPLE_DATA`. It gives us legitimate merchant entities in Kolkata to detect sticker swaps."*

* **If asked how CoCo helped:**
  *"Snowflake CoCo (Cortex Code) discovered the Cybersyn POI dataset, designed our Zero-PII `QR_REGISTRY` staging table, and authored the analytical views: `V_FRAUD_HOTSPOTS_BY_AREA`, `V_STICKER_SWAP_ANOMALIES`, and `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF`."*

* **If asked how open-weight AI connects:**
  *"Google Gemma 4 consumes Snowflake's `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF` risk tiers to generate plain-language English and Bengali threat advisories for citizens."*

* **If asked about license and repo:**
  *"100% open-source under the MIT License, public at `https://github.com/debangshuuii/QR-RAKSHA` with 7 automated unit tests passing."*

---

## 🛡️ Limitations (Honesty Rule)

*"We cannot verify the ultimate bank ownership of a personal VPA, and a freshly registered zero-day domain without known patterns may not trigger static domain heuristics. SAFE means 'no known red flags detected' — users must always glance at the verified name in their payment app before typing their UPI PIN."*
