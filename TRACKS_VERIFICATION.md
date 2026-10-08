# 🛡️ Challenge Tracks Verification Dossier & Stand Proof

> **Project:** [TrailQR Raksha](https://github.com/debangshuuii/QR-RAKSHA)  
> **Event:** Hacktoberfest Hack Day × OWASP JIS University  
> **Team:** Team Raksha (Sudipta Sanki, Soumyabrata Mukherjee, Debangshu Sinha — Techno Main Salt Lake)  
> **License:** MIT License (Permissive Open-Source)  
> **Verification Status:** ✅ **100% Verified Across All 4 Challenge Tracks**

---

## 📋 Comprehensive Track Compliance Matrix

| Challenge Track | Mandatory Track Requirements | TrailQR Raksha Implementation | Verification Proof File / Command |
| :--- | :--- | :--- | :--- |
| **1. Open-Source AI Prize Challenge** | • Open-source/open-weight AI substantive use<br>• Public GitHub repo + open-source license<br>• Agent skill following Open Standard<br>• Model-harness entry with original implementation | • Google Gemma 4 used for vernacular security translation & quests<br>• Public repo under MIT License<br>• Standardized Agent Skill in `skills/qr-audit/`<br>• Automated 16-assertion AI model evaluation harness | [`skills/qr-audit/SKILL.md`](skills/qr-audit/SKILL.md)<br>[`harness/eval_harness.mjs`](harness/eval_harness.mjs)<br>`node harness/eval_harness.mjs`<br>[`LICENSE`](LICENSE) |
| **2. Google Gemma** | • Best use of Gemma 4 (multimodal text/images)<br>• Focused tool for community safety<br>• Fast prototyping with Gemini API / offline fallback | • Multimodal QR image & text ingestion<br>• Community defense for street micro-transactions<br>• Dual-mode runtime (live Gemini API + zero-network offline fallback) | [`js/gemma.js`](js/gemma.js)<br>[`app.js`](app.js)<br>Dual-mode indicator badge in UI |
| **3. Snowflake** | • Explore Snowflake Marketplace / sample data with CoCo<br>• Use CoCo to write queries / build data pipeline<br>• Build an open-source AI project combining all 3 | • Cybersyn POI dataset on Snowflake Marketplace<br>• CoCo-generated views for fraud hotspots & sticker-swap anomalies<br>• Gemma 4 consumes Snowflake security corridor feed | [`snowflake/COCO.md`](snowflake/COCO.md)<br>[`snowflake/schema.sql`](snowflake/schema.sql)<br>[`snowflake/pipeline.js`](snowflake/pipeline.js)<br>`node snowflake/pipeline.js` |
| **4. AI in Cybersecurity (OWASP JIS)** | • Real cybersecurity problem (QR sticker swap & quishing)<br>• Functional security control (pre-payment check)<br>• Meaningful AI relationship (rules decide, AI explains)<br>• Limitations identified & responsible disclosure | • Mitigates pre-transaction financial fraud<br>• 14-heuristic deterministic analysis engine<br>• Separation of concerns: rules decide, AI explains<br>• Discloses limitations & enforces zero-PII privacy | [`js/rules.js`](js/rules.js)<br>[`tests/rules.test.mjs`](tests/rules.test.mjs)<br>`node --test tests/rules.test.mjs` |

---

## 🔍 Detailed Evidence & Proof by Track

### Track 1: Open-Source AI Prize Challenge 🤖 (Main Hack Day Challenge)

#### Requirement 1.1: Open-source or open-weight AI must be an important part of the project.
* **Proof:** Rather than a cosmetic wrapper, Google Gemma 4 (open-weight AI) is an essential architectural bridge. The deterministic engine produces opaque technical flags (e.g., `EMVCo tag 59 mismatch`, `entropy 4.2`, `PSP non-standard`). Gemma 4 translates these heuristics into plain English and a vernacular Bengali advisory line (*"বিপদ — এই QR ব্যবহার করবেন না..."*), democratizing cybersecurity for non-technical street vendors and citizens.
* **Evidence File:** [`js/gemma.js`](js/gemma.js)

#### Requirement 1.2: Published in a public GitHub repository and use an open-source license.
* **Proof:** Publicly hosted at [https://github.com/debangshuuii/QR-RAKSHA](https://github.com/debangshuuii/QR-RAKSHA) under the MIT License.
* **Evidence File:** [`LICENSE`](LICENSE)

#### Requirement 1.3: An agent skill must comply with the Agent Skill Open Standard.
* **Proof:** Created [`skills/qr-audit/SKILL.md`](skills/qr-audit/SKILL.md) following the Agent Skill Open Standard with valid YAML frontmatter:
  ```yaml
  ---
  name: qr-audit
  description: Audit a decoded QR code payload for payment and phishing risk. Use when a user presents a QR code (UPI, URL, Wi-Fi or text) and needs a safety verdict before paying or opening it, or when logging a found QR to a scrubbed community registry.
  ---
  ```
  Includes operational instructions, parameters, and limitations.

#### Requirement 1.4: Model-harness entry must include an original implementation.
* **Proof:** Developed an original model evaluation harness [`harness/eval_harness.mjs`](harness/eval_harness.mjs) that benchmarks model outputs across 4 dimensions:
  1. *Safety Alignment:* Model never contradicts the deterministic verdict.
  2. *Vernacular Fidelity:* Validates Bengali security tokens (`বিপদ`, `সাবধান`, `নিরাপদ`).
  3. *Zero-PII Preservation:* Ensures model outputs never leak raw VPAs or unmasked account numbers.
  4. *Latency SLA:* Asserts evaluation execution completes within edge performance limits (< 10ms).
* **Verification Command:**
  ```bash
  node harness/eval_harness.mjs
  ```
  *Output:* `16/16 Model Harness Checks Passed (100.0% Success Rate)`.

---

### Track 2: Google Gemma 🤍 (Partner Challenge: Best Open-Source AI Project with Gemma)

#### Requirement 2.1: Work with text and images to create an assistant.
* **Proof:**
  - **Multimodal Inputs:** Accepts image uploads (drag-and-drop, file upload, clipboard screenshot paste) and live camera streams.
  - **Triple-Engine Image Decoder:** Native `BarcodeDetector` + `jsQR` + `ZXing` with multi-pass contrast enhancement and center-crop zooming.
  - Passes decoded text alongside the visual physical shop name to Gemma 4.
* **Evidence Files:** [`index.html`](index.html), [`app.js`](app.js)

#### Requirement 2.2: Build a focused AI tool for your community.
* **Proof:** Designed specifically for street communities in Kolkata and West Bengal who transact daily on UPI. Provides localized safety advice and rewards community verifications with safe-find quests exploring local heritage.
* **Evidence File:** [`js/gemma.js`](js/gemma.js) (`fallbackQuest`)

#### Requirement 2.3: Fast prototyping with Gemini API while supporting open models.
* **Proof:** Uses the Gemini API endpoint for Gemma 4 (`models/gemma-4-it:generateContent`) with zero cloud dependencies, backed by a deterministic offline fallback that operates seamlessly without internet access.
* **Evidence File:** [`js/gemma.js`](js/gemma.js) (`explain`)

---

### Track 3: Snowflake ❄️ (Partner Challenge: Best Open-Source AI Project with Snowflake)

#### Requirement 3.1: Explore Snowflake Marketplace or sample data with CoCo.
* **Proof:**
  - Engaged Snowflake CoCo (Cortex Code) to discover and evaluate datasets.
  - Integrated the freely accessible **Cybersyn: Point of Interest (POI) & Business Open Data** listing from Snowflake Marketplace (`CYBERSYN.POIS_INDEX`), alongside `SNOWFLAKE_SAMPLE_DATA`.
* **Evidence File:** Complete prompt log and transcript in [`snowflake/COCO.md`](snowflake/COCO.md).

#### Requirement 3.2: Use CoCo to understand the dataset, write queries, or create a data pipeline.
* **Proof:**
  - CoCo authored the DDL in [`snowflake/schema.sql`](snowflake/schema.sql):
    - `TRAILQR.REGISTRY.QR_REGISTRY`: Telemetry table with zero-PII scrubbing.
    - `V_FRAUD_HOTSPOTS_BY_AREA`: Locality threat density and fraud percentage view.
    - `V_STICKER_SWAP_ANOMALIES`: Joins community scans with Cybersyn POI to flag sticker swaps.
    - `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF`: Corridors risk feed for Gemma 4.
  - Automated pipeline runnable in Node.js ([`snowflake/pipeline.js`](snowflake/pipeline.js)) and Python ([`snowflake/pipeline.py`](snowflake/pipeline.py)).
* **Verification Command:**
  ```bash
  node snowflake/pipeline.js
  ```

#### Requirement 3.3: Combine CoCo, freely accessible Snowflake dataset, and open-weight AI.
* **Proof:**
  - Telemetry is ingested into Snowflake ➔ Joined with Cybersyn POI to detect sticker swaps ➔ Filtered into `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF` ➔ Passed into Google Gemma 4 for vernacular briefings.
  - Visible live in Section 03 of the web application under the **"❄️ Snowflake CoCo Intelligence"** tab.

---

### Track 4: AI in Cybersecurity — OWASP JIS University Challenge 🧑🏻💻

#### Requirement 4.1: Address a real and clearly defined cybersecurity problem.
* **Proof:**
  - **Threat 1 (Physical/Digital Redirection):** QR Sticker Swap attack (fraudsters paste duplicate stickers over merchant counters).
  - **Threat 2 (Quishing / Social Engineering):** Fake "KYC Update" or "Lottery Refund" QR stickers pointing to lookalike phishing domains.
  - **Vulnerability:** Visual opacity of 2D matrix; payment applications only reveal true payees *inside* the execution flow.
* **Evidence File:** [`README.md`](README.md) (Problem & Threat Model)

#### Requirement 4.2: Demonstrate a functional security-related implementation.
* **Proof:** 14-heuristic deterministic analysis engine in [`js/rules.js`](js/rules.js):
  - Shop name vs payee handle mismatch (`NAME_MISMATCH`)
  - Random numeric / personal handles (`UPI_RANDOM_PAYEE`)
  - Pre-filled transaction amounts (`PREFILLED_AMOUNT`)
  - Insecure protocol usage (`HTTP_NOT_HTTPS`)
  - Brand spoofing in subdomains (`BRAND_IN_HOST`)
  - Urgent social engineering words (`SUSPICIOUS_WORDS`)
  - URL shorteners & obfuscation (`SHORTENER`)
  - Official EMVCo BharatQR merchant parser (`isBusiness: true`, MCC extraction)
* **Verification Command:**
  ```bash
  node --test tests/rules.test.mjs
  ```
  *Output:* `8/8 tests pass`.

#### Requirement 4.3: Meaningful relationship between AI and cybersecurity.
* **Proof:**
  - **Architectural Principle:** Deterministic rules *decide* the security verdict; AI *explains* and *correlates* it.
  - Prevents LLM hallucinations or prompt injection attacks from altering security verdicts.
* **Evidence File:** [`skills/qr-audit/SKILL.md`](skills/qr-audit/SKILL.md)

#### Requirement 4.4: Identify limitations and potential failure cases.
* **Proof:**
  - Disclosed transparently in UI, [`README.md`](README.md), and [`skills/qr-audit/SKILL.md`](skills/qr-audit/SKILL.md):
    1. A `SAFE` verdict indicates "no known red flags detected" rather than bank-level legal indemnification.
    2. Zero-day phishing domains without recognizable keywords may not trigger static heuristic rules.

#### Requirement 4.5: Follow responsible security practices throughout development.
* **Proof:**
  - **Zero-PII Guarantee:** Only cryptographic FNV-1a hashes, masked VPAs (`ch***@okhdfcbank`), and coarse areas are exported or persisted.
  - **Credential Safety:** API keys are excluded from source control (`config.js` is git-ignored, only `config.example.js` committed).
* **Evidence File:** [`.gitignore`](.gitignore)

---

## 🎯 Verification Command Summary for Hackathon Judges

Run these commands in terminal to prove all components execute cleanly:

```bash
# 1. Run Core Security & Model Harness Tests (8/8 assertions passing)
node --test tests/rules.test.mjs

# 2. Run Open-Weight AI Model Evaluation Harness (16/16 checks passing)
node harness/eval_harness.mjs

# 3. Run Snowflake CoCo Threat Analytics & Cybersyn POI Pipeline
node snowflake/pipeline.js
```
