# 🎯 Live Judging & Demo Playbook

> **Event:** Hacktoberfest Hack Day × OWASP JIS University  
> **Team:** Team Raksha (Sudipta Sanki, Soumyabrata Mukherjee, Debangshu Sinha — Techno Main Salt Lake)  
> **Project:** [TrailQR Raksha](https://github.com/debangshuuii/QR-RAKSHA)  
> **Golden Rule for Judges:** *"Your pitch gets our attention. Your implementation earns it."*

---

## ⚡ The 15-Second Judge Elevator Pitch

> **What did you build?**  
> *"We built TrailQR Raksha: an offline-first QR security defense guard designed for street micro-transactions across Kolkata and West Bengal."*  
> 
> **Why does it matter?**  
> *"India runs on QR codes, but 2D matrices are visually opaque. A single fake sticker pasted over a tea stall's payment QR sends your money to a scammer, or a fake KYC QR steals your bank credentials before you ever realize it."*  
> 
> **How does it work?**  
> *"Deterministic rules inspect 14 red flags to decide the verdict; Google Gemma 4 explains it in plain English and vernacular Bengali; and Snowflake CoCo aggregates neighborhood threat data using the Cybersyn Marketplace POI dataset."*  
> 
> **Can you prove that it works?**  
> *"Yes! We have a live working web app running right here with zero cloud dependencies, 8 automated tests passing, an original AI model evaluation harness, and an end-to-end Snowflake data pipeline."*

---

## ⏱️ Recommended Demonstration Structure (3 Minutes Total)

```
[0:00 - 0:30] Problem ➔ [0:30 - 0:50] Solution ➔ [0:50 - 2:05] Live Working Demo ➔ [2:05 - 2:40] Technical Approach ➔ [2:40 - 3:00] Limitations
```

### 1. Problem (30s)
* **What you say:**
  > *"Walk down College Street, Park Street, or Gariahat: every tea stall, taxi, and grocery shop has a UPI QR stand. When a customer scans to pay ₹10 for chai, they cannot inspect where that 2D barcode actually routes before scanning. Fraudsters exploit this in two ways: **QR sticker-swap attacks**, where they physically paste a duplicate QR over a shop's counter, and **credential phishing QR codes**, claiming to offer refunds or KYC updates. Victims only discover the theft after their money is gone."*

### 2. Solution (20s)
* **What you say:**
  > *"TrailQR Raksha checks any QR code **before you pay or open it**. It evaluates the code locally using 14 deterministic heuristics, translates technical red flags into plain English and native Bengali through open-weight Google Gemma 4, and pushes privacy-scrubbed telemetry to a community Snowflake registry to track fraud hotspots."*

---

### 3. Live Demonstration: Problem ➔ Solution ➔ Demo ➔ Result (75s)

*Open `index.html` on your laptop and execute these 4 steps in front of the judge:*

#### Step A: Safe Merchant Scan
* **Action:** Click **"Safe shop UPI"** in Section 01 ➔ Click **"Check this QR"**.
* **What the judge sees:** Verdict **`🛡️ SAFE 0/100`**, shop name matches payee, verified handle, Safe Trail Quest unlocks.
* **What you say:** *"Here, the scanned handle matches the physical shop sign 'Chai Dukaan'. Threat score is zero, and a Bengali exploration quest unlocks to reward verification."*

#### Step B: Sticker-Swap Fraud Scan
* **Action:** Click **"Sticker-swap UPI"** in Section 01 ➔ Click **"Check this QR"**.
* **What the judge sees:** Verdict **`🚨 DANGEROUS 75/100`**, flags show `NAME_MISMATCH (+40)` and `UPI_RANDOM_PAYEE (+25)`, pre-filled amount detected.
* **What you say:** *"Now look at this sticker swap: the shop sign says 'Chai Dukaan', but the QR pays a random personal handle `rk8492017365@paytm` and pre-fills ₹499. The rule engine catches the mismatch instantly. Below, Google Gemma 4 explains it in plain English and native Bengali: 'বিপদ — এই QR ব্যবহার করবেন না'."*
* **Action:** Click **"Report this QR Fraud"** ➔ show success toast.

#### Step C: Phishing Link Scan
* **Action:** Click **"Phishing link QR"** in Section 01 ➔ Click **"Check this QR"**.
* **What the judge sees:** Verdict **`🚨 DANGEROUS 100/100`** (insecure HTTP, fake Russian domain, brand spoofing).
* **What you say:** *"Here, a quishing sticker claims to be Paytm KYC verification on an insecure HTTP Russian domain. Blocked before the user's browser opens."*

#### Step D: Snowflake CoCo Intelligence & Cybersyn POI Cross-Reference
* **Action:** Scroll to **Section 03** ➔ Click **"📥 Load Demo Street Telemetry"** ➔ Switch to the **"❄️ Snowflake CoCo Intelligence"** tab.
* **What the judge sees:**
  1. *Neighborhood Hotspots:* Rabindra Sarobar (50% fraud rate), Park Street (100% fraud rate).
  2. Click **"🛡️ Sticker-Swap Anomalies"**: Scanned name `Chai Dukaan` is cross-referenced against Cybersyn verified merchants from Snowflake Marketplace. The fake scan with `rk***@paytm` is highlighted as `🚨 Confirmed Sticker Swap Fraud`.
  3. Click **"📜 CoCo SQL DDL"**: Shows the exact views generated with Snowflake Cortex Code (CoCo).
* **What you say:** *"When audits are logged, zero PII leaves the phone. In Snowflake, our CoCo-generated pipeline joins scans against the Cybersyn Point of Interest dataset from Snowflake Marketplace to identify sticker swaps by locality and feed risk corridors into Gemma."*

---

### 4. Technical Approach & Architecture (35s)
* **What you say:**
  > *"We made deliberate engineering choices:*  
  > *1. **Strict Separation of Concerns:** Rules decide; AI explains. A deterministic engine in `js/rules.js` evaluates security. Open-weight Google Gemma 4 translates flags into local languages. Gemma is never allowed to override verdicts, making the system immune to prompt injection.*  
  > *2. **Zero Dependencies & Zero-PII:** The app runs in vanilla HTML5/JS without npm builds. Only one-way FNV-1a hashes and masked handles are persisted.*  
  > *3. **Triple-Engine Image Decoder:** Combines native BarcodeDetector with jsQR and ZXing-JS with adaptive binarization to read dense codes like EMVCo BharatQR.*  
  > *4. **Snowflake Pipeline:** Dual-runtime pipeline scripts (Node.js and Python) ingest telemetry and cross-reference Cybersyn Marketplace POI data."*

---

### 5. Limitations (Honesty Disclosure) (15s)
* **What you say:**
  > *"To be completely transparent about limitations:*  
  > *1. A `SAFE` verdict means 'no known red flags detected' rather than absolute bank indemnification. We always advise users to check the payee name in their UPI app before typing their PIN.*  
  > *2. Brand-new zero-day phishing domains without recognizable keywords may not trigger static domain heuristics.*  
  > *3. Live camera scanning varies across desktop OS backends, which is why we built universal image upload, drag-and-drop, and clipboard paste."*

---

## 🛡️ Deep-Dive: Cybersecurity Track (OWASP JIS University)

Be prepared to answer the **Attack ➔ Vulnerability ➔ Control ➔ Result** framework:

| Question | Your Exact Answer |
| :--- | :--- |
| **Who is the attacker?** | Street fraudsters who print physical QR stickers and paste them over authentic shop stands, or malicious actors distributing fake KYC/refund stickers. |
| **What is the attack vector?** | Physical barcode replacement (sticker-swap) and social engineering URL redirection (quishing). |
| **What are you protecting?** | The consumer's bank balance, UPI PIN, and banking credentials during daily micro-transactions. |
| **What does it detect, prevent, or mitigate?** | Detects payee-name discrepancies, pre-filled unauthorized charges, suspicious handles, and phishing domains. Prevents payments from being initiated blindly. |
| **How does the security control work?** | Decodes the payload in a sandboxed client-side parser, scores it against 14 red-flag heuristics, checks EMVCo merchant tags, and enforces Zero-PII masking. |
| **How did you test it?** | 8 automated Node.js test assertions in `tests/rules.test.mjs`, including BharatQR business parsing, payee masking, and a 16-check AI model evaluation harness. |

---

## 🤖 Deep-Dive: Open-Source AI Track & Google Gemma Track

| Question | Your Exact Answer |
| :--- | :--- |
| **Which model did you use?** | **Google Gemma 4** (`gemma-4-it`), an open-weight multimodal/language model. |
| **Why did you choose it?** | It is lightweight, open-weight, accessible via the Gemini API, and excels at multilingual vernacular translation (English to Bengali). |
| **Where is it used?** | In the explanation layer (`js/gemma.js`), translating technical heuristics into actionable vernacular advisories, and generating exploration quests for clean QRs. |
| **What does it contribute?** | Technical flags like `EMVCo tag 59 mismatch` mean nothing to a street shopper. Gemma translates them into *"বিপদ — এই QR ব্যবহার করবেন না"*, making cybersecurity accessible to everyone. |
| **How can it be reproduced?** | Works out-of-the-box via the built-in deterministic offline fallback with zero API keys required, or with any Google AI Studio API key in `config.js`. Tested via our original model harness in `harness/eval_harness.mjs`. |
| **What are its limitations?** | AI is strictly restricted from deciding verdicts; it only explains. If external cloud networks fail, the deterministic offline fallback runs instantaneously (< 1ms). |
| **Developer Tools Disclosure:** | Google Antigravity IDE, Snowflake Cortex Code (CoCo), and GitHub Copilot were used as coding assistants (disclosed in `README.md` and `SUBMISSION.md`). |

---

## ❄️ Deep-Dive: Snowflake Track (Winner Guidance)

| Question | Your Exact Answer |
| :--- | :--- |
| **Identify the dataset:** | **Cybersyn: Point of Interest & Business Open Data** from Snowflake Marketplace (`CYBERSYN.POIS_INDEX`), alongside `SNOWFLAKE_SAMPLE_DATA`. |
| **Show how CoCo helped:** | Snowflake CoCo (Cortex Code) discovered the Cybersyn POI listing, designed our Zero-PII `QR_REGISTRY` staging schema, and authored the analytical views: `V_FRAUD_HOTSPOTS_BY_AREA`, `V_STICKER_SWAP_ANOMALIES`, and `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF` (logged in `snowflake/COCO.md`). |
| **How AI connects with Snowflake:** | Snowflake aggregates neighborhood threat density and sticker swaps into risk tiers (`HIGH_RISK_CORRIDOR`, `ELEVATED_CAUTION`). This feed directly powers Google Gemma 4's localized risk debriefs. |

---

## 💻 5-Second Terminal Proof Commands

If a technical judge asks to see verification in the terminal:

```bash
# Proof 1: Core Security Rules & AI Harness (8/8 tests pass)
node --test tests/rules.test.mjs

# Proof 2: Open-Weight AI Model Evaluation Benchmark (16/16 checks pass, 100% rate)
node harness/eval_harness.mjs

# Proof 3: Snowflake CoCo Pipeline & Cybersyn POI Cross-Reference
node snowflake/pipeline.js
```
