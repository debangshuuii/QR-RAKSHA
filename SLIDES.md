# 📊 Hacktoberfest Snowflake Opening Slides — Presentation Deck Guide

> **Event:** Hacktoberfest Hack Day × OWASP JIS University  
> **Challenge Category:** Best Open-Source AI Project with Snowflake  
> **Instructions:** Use the official Hacktoberfest Snowflake opening slides template provided in your event onboarding. Make a copy and replace the editable host-controlled slides with the content below.

---

## 🖥️ Slide 1: Title Slide (Host-Controlled)

* **Project Title:** **TrailQR Raksha** (ট্রেইলকিউআর সুরক্ষা)
* **Subtitle:** Offline-First Street QR Fraud Defense Powered by Snowflake CoCo & Google Gemma 4
* **Track:** Best Open-Source AI Project with Snowflake · Open-Source AI · OWASP AI in Cybersecurity
* **Team Name:** Team Raksha
* **Team Members:**
  - Sudipta Sanki (2nd Year CSE, Techno Main Salt Lake)
  - Soumyabrata Mukherjee (2nd Year CSE, Techno Main Salt Lake)
  - Debangshu Sinha (2nd Year CSE, Techno Main Salt Lake)
* **GitHub Repository:** [https://github.com/debangshuuii/QR-RAKSHA](https://github.com/debangshuuii/QR-RAKSHA) (MIT Licensed)

> **Speaker Notes:**  
> *"Good morning judges! India runs on QR codes. One sticker pasted over a shop's real QR and your money goes to a fraudster. We built TrailQR Raksha: deterministic rules decide, Google Gemma 4 explains, and Snowflake CoCo aggregates neighborhood threat intelligence using the Cybersyn Marketplace dataset."*

---

## 🖥️ Slide 2: The Problem & Street Threat Model (Host-Controlled)

* **The Attack:** **QR Sticker Swap & Credential Phishing**
  - Fraudsters paste fake UPI stickers over legitimate tea stalls, stores, and parking lots.
  - Phishing stickers push lookalike "KYC Update" and "Refund" links that steal bank credentials.
* **The Vulnerability:** **Blind Matrix Trust**
  - 2D QR matrix is human-unreadable.
  - Victims only discover the fraudulent recipient *inside* the payment app when it's too late.
* **The Solution:** **TrailQR Raksha**
  - **Deterministic 14-rule engine** checks the QR *before* money moves.
  - **Zero-PII guarantee:** Never stores raw payloads, accounts, or exact GPS.

> **Speaker Notes:**  
> *"When you scan a QR on the street, you can't read the matrix. Scammers exploit this by pasting fake QR stickers over authentic tea stall counters. TrailQR Raksha audits the payload locally and scores it against 14 red flags before you ever open your payment app."*

---

## 🖥️ Slide 3: The 3 Snowflake Category Pillars (Host-Controlled)

| MLH Requirement | Our Implementation | Proof of Work |
| :--- | :--- | :--- |
| **1. Snowflake CoCo (Cortex Code)** | Used CoCo AI coding agent for discovery, schema analysis, and automated threat views | Prompt log in `snowflake/COCO.md` + Snowsight DDL |
| **2. Freely Accessible Dataset** | **Cybersyn: Point of Interest & Business Open Data** from Snowflake Marketplace + `SNOWFLAKE_SAMPLE_DATA` | Cross-references merchant names to catch sticker swaps |
| **3. Open-Source / Open-Weight AI** | **Google Gemma 4** (open-weight) fed by Snowflake security tiers (`V_GEMMA_AI_NEIGHBOURHOOD_BRIEF`) | Vernacular Bengali & English debriefs (`js/gemma.js`) |

> **Speaker Notes:**  
> *"Our project directly combines all three required elements: Snowflake CoCo helped us discover datasets and write analytics views; we used the freely accessible Cybersyn Point of Interest dataset from Snowflake Marketplace; and we connected this to open-weight Google Gemma 4 to explain threat patterns in plain English and Bengali."*

---

## 🖥️ Slide 4: Data Pipeline Architecture & CoCo Journey (Host-Controlled)

```
[Street QR Scan] 
       │
       ▼
[Local Deterministic Engine] ──(Zero-PII Scrubbing)──► [Snowflake QR_REGISTRY]
                                                              │
   [Snowflake Marketplace: Cybersyn POI Dataset] ──────────────┤
                                                              │
                                                              ▼
                                                   [CoCo Generated Views]
                                                   • V_FRAUD_HOTSPOTS_BY_AREA
                                                   • V_STICKER_SWAP_ANOMALIES
                                                   • V_GEMMA_AI_NEIGHBOURHOOD_BRIEF
                                                              │
                                                              ▼
                                                   [Google Gemma 4 AI]
                                                   (English + Bengali Debriefs)
```

* **CoCo Contribution:**
  1. **Discovered** the Cybersyn POI dataset on Snowflake Marketplace.
  2. **Designed** the `QR_REGISTRY` schema ensuring zero-PII compliance.
  3. **Wrote** `V_STICKER_SWAP_ANOMALIES` to fuzzy-match community scans with Cybersyn verified merchants.
  4. **Created** `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF` to feed high-risk corridor tiers into Gemma 4.

> **Speaker Notes:**  
> *"Here is how data flows: When community members scan QRs, only cryptographic hashes and coarse areas are exported to Snowflake. Snowflake CoCo wrote queries that cross-reference these scans with Cybersyn's verified merchant directory, instantly catching sticker-swap anomalies and feeding structured threat briefs into Gemma 4."*

---

## 🖥️ Slide 5: Live Demo & Key Takeaways (Host-Controlled)

* **Key Highlights:**
  - ⚡ **Zero Dependencies:** Runs directly in any modern browser (`index.html`) or via `http://localhost:8000`.
  - 🛡️ **Tested & Proven:** 7 automated test assertions passing (`node --test tests/rules.test.mjs`).
  - ❄️ **Interactive Snowflake Panel:** Preload demo street telemetry and view live hotspot statistics and Cybersyn POI anomaly matches.
  - 🌐 **100% Open Source:** MIT License on GitHub at [debangshuuii/QR-RAKSHA](https://github.com/debangshuuii/QR-RAKSHA).
* **Live Demo Flow:**
  1. Scan / Pick sample: `Sticker-swap UPI` ➔ `DANGEROUS 75/100`.
  2. Gemma Vernacular Explanation: Bengali guidance (*"বিপদ — এই QR ব্যবহার করবেন না..."*).
  3. Preload Community Registry ➔ View Snowflake CoCo Intelligence Tab.
  4. Inspect Cybersyn POI sticker-swap anomaly detection live.

> **Speaker Notes:**  
> *"Everything is live and testable right now. You can open index.html, load demo street telemetry, and see our CoCo pipeline identify sticker swaps in Kolkata. Thank you, and we're ready for your questions!"*
