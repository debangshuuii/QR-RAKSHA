# 🏆 Snowflake Category: Winner Selection & Judge Q&A Guide

> **MLH Challenge Track:** Best Open-Source AI Project with Snowflake  
> **Target Evaluation:** Direct answers to the exact questions MLH judges will ask.

---

## 🎯 The 4 Questions Judges Will Ask (And Your Exact Answers)

### ❓ Question 1: "Identify the dataset — which freely accessible Snowflake dataset did you use?"
**Your 20-Second Answer:**
> *"We used the freely accessible **Cybersyn: Point of Interest & Business Open Data** listing from the Snowflake Marketplace, alongside **SNOWFLAKE_SAMPLE_DATA**.*  
> *In West Bengal, the biggest street scam is the **QR sticker-swap** — fraudsters paste personal UPI QR stickers over authentic tea stalls and shops. By cross-referencing our community scan logs against Cybersyn's verified business database, Snowflake instantly detects whether the scanned payee matches the authentic registered shop in that neighborhood."*

* **Dataset Name:** `Cybersyn: Point of Interest & Business Open Data`
* **Source:** Snowflake Marketplace (Listing: `CYBERSYN.POIS_INDEX` / `CYBERSYN_VERIFIED_MERCHANTS`)
* **Official Reference:** [Snowflake Marketplace Consumer Listings Guide](https://docs.snowflake.com/en/collaboration/consumer-listings-exploring) & [Snowflake Sample Data](https://docs.snowflake.com/en/user-guide/sample-data)
* **Code Reference:** [`snowflake/schema.sql`](schema.sql) (Lines 27–52)

---

### ❓ Question 2: "Show how CoCo helped you explore the data or build the project."
**Your 30-Second Answer:**
> *"Snowflake CoCo (Cortex Code) was our AI data engineering partner across four stages:*  
> *1. **Discovery:** We asked CoCo to find freely accessible datasets in Snowflake Marketplace related to merchant places and cybersecurity.*  
> *2. **Schema Design:** CoCo wrote our Zero-PII telemetry schema (`QR_REGISTRY`), ensuring only cryptographic FNV-1a hashes and masked handles are persisted.*  
> *3. **Analytics Pipeline:** CoCo authored `V_FRAUD_HOTSPOTS_BY_AREA` to calculate scam rates by locality, and `V_STICKER_SWAP_ANOMALIES` which performs fuzzy name matching against Cybersyn POI.*  
> *4. **AI Bridge:** CoCo built `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF`, structuring high-risk corridors that feed directly into our Google Gemma 4 model."*

* **Show the Judge:**
  1. Open the web app ➔ Scroll to **Section 03** ➔ Click the **"❄️ Snowflake CoCo Intelligence"** tab.
  2. Click **"📍 Neighborhood Hotspots"** to show fraud percentages.
  3. Click **"🛡️ Sticker-Swap Anomalies"** to show Cybersyn POI matching in action.
  4. Click **"📜 CoCo SQL DDL"** to show the exact queries CoCo wrote.
  5. Show [`snowflake/COCO.md`](COCO.md) in the GitHub repository containing the complete prompt transcript.

---

### ❓ Question 3: "How does open-weight AI integrate with this?"
**Your 20-Second Answer:**
> *"We integrated **Google Gemma 4** (open-weight AI). While our deterministic 14-rule engine makes the objective security verdict (SAFE/DANGEROUS), Snowflake aggregates the community risk across neighborhoods. The Snowflake view `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF` outputs structured risk tiers (`HIGH_RISK_CORRIDOR`, `ELEVATED_CAUTION`) which feed Gemma 4 to produce localized English and vernacular Bengali safety briefings ('বিপদ — এই QR ব্যবহার করবেন না')."*

* **Model:** Google Gemma 4 (open-weight)
* **Rule vs AI Separation:** Security verdicts are 100% deterministic (reproducible & immune to hallucination); Gemma and Snowflake explain and correlate.
* **Code Reference:** [`js/gemma.js`](../js/gemma.js) & [`snowflake/pipeline.js`](pipeline.js)

---

### ❓ Question 4: "Is this published in a public GitHub repository with an open-source license?"
**Your 10-Second Answer:**
> *"Yes, the entire project is open-source under the **MIT License** and publicly hosted on GitHub at `https://github.com/debangshuuii/QR-RAKSHA`."*

* **Repository:** [https://github.com/debangshuuii/QR-RAKSHA](https://github.com/debangshuuii/QR-RAKSHA)
* **License File:** [`LICENSE`](../LICENSE) (MIT)
* **Automated Tests:** 7/7 passing unit tests (`node --test tests/rules.test.mjs`)

---

## ⚡ 30-Second Live Demonstration Checklist for Snowflake Judges

When the Snowflake judge walks up to your laptop:
1. **Step 1:** Open `index.html` in browser.
2. **Step 2:** Click **"Sticker-swap UPI"** in Section 01 ➔ Click **"Check this QR"** ➔ Show `DANGEROUS 75/100` and Gemma Bengali explanation.
3. **Step 3:** Scroll down to **Section 03: Community Registry & Snowflake Pipeline**.
4. **Step 4:** Click **"📥 Load Demo Street Telemetry"** ➔ Show 5 Kolkata street scans populated with zero PII.
5. **Step 5:** Switch to the **"❄️ Snowflake CoCo Intelligence"** tab:
   - Point to **Rabindra Sarobar (50% fraud rate)** and **Park Street (100% fraud rate)**.
   - Click **"🛡️ Sticker-Swap Anomalies"** ➔ Show `Chai Dukaan` flagged as `🚨 Confirmed Sticker Swap Fraud` because payee `rk***@paytm` does not match Cybersyn verified merchant `chaidukaan@okhdfcbank`.
   - Click **"📜 CoCo SQL DDL"** ➔ Show the CoCo-generated views.
6. **Step 6 (Optional Terminal Execution):** Run `node snowflake/pipeline.js` to show the end-to-end data pipeline running locally in under 1 second.
