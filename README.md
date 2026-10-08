# TrailQR Raksha — Check a QR Before You Pay

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Tests](https://img.shields.io/badge/tests-8%20passed-brightgreen.svg)](#tests)
[![Track](https://img.shields.io/badge/OWASP-AI%20in%20Cybersecurity-red.svg)](#tracks-entered)
[![Track](https://img.shields.io/badge/Google-Gemma%204-blue.svg)](#tracks-entered)
[![Track](https://img.shields.io/badge/Snowflake-CoCo%20%26%20Marketplace-lightblue.svg)](#tracks-entered)

Kolkata — and India — runs on QR codes. Tea stalls, taxis, parking, donations, ticket counters: you scan, you pay, you move on. One sticker pasted over a shop's real QR and your payment goes to a scammer, or a "KYC verify" QR takes you to a credential phishing site. You cannot see where a QR goes until it is too late.

**TrailQR Raksha** is a privacy-first, offline-capable QR security guard built for street environments across West Bengal.

---

## 📑 Table of Contents
1. [Section 1: About the Project](#section-1-about-the-project)
   - [The Problem](#the-problem)
   - [How It Works](#how-it-works)
   - [Tracks Entered](#tracks-entered)
   - [How to Run](#how-to-run)
   - [Automated Tests](#tests)
   - [Technology Stack](#technologies)
   - [Limitations](#limitations)
2. [Section 2: Team Information](#section-2-team-information)
3. [Section 3: Open-Source License & Disclosures](#section-3-open-source-license--disclosures)

### 📚 Judging & Hackathon Documentation
* 🎯 **[Live Judging Playbook](JUDGING_PLAYBOOK.md):** 3-minute pitch, live demo steps, and track defense answers.
* 📝 **[Official Submission Form](SUBMISSION.md):** Ready-to-submit form with all 10 required fields.
* 🧠 **[AI Tools & Skills Guide (SKILLS.md)](SKILLS.md):** Open-weight AI documentation, Agent Skill compliance, and original model harness.
* 🛡️ **[Track Verification Dossier](TRACKS_VERIFICATION.md):** Evidence and proofs for all 4 challenge tracks.
* 📊 **[Presentation Slides Deck](SLIDES.md):** Copy-paste slides for Hacktoberfest opening slide deck.
* ❄️ **[Snowflake CoCo Guide](snowflake/COCO.md):** CoCo prompt transcripts, Cybersyn POI dataset, and DDL views.

---

# Section 1: About the Project

### The Problem
* **Sticker Swap:** An attacker pastes a duplicate UPI QR sticker over a merchant's authentic code (e.g. at a tea stall or auto stand). Customers pay the fraudster all day without realizing.
* **Phishing QR:** Malicious stickers claiming "KYC Update", "Refund", or "Lottery Offer" link to lookalike domains stealing UPI PINs, OTPs, and banking credentials.
* **Invisible Destination:** A 2D QR matrix is human-unreadable. Unlike a hyperlink, victims cannot inspect the payee address, domain, or pre-filled transaction amounts before acting.

### How It Works: The 5-Step Architecture
1. **Decode & Decide Locally (Deterministic Rule Engine):**
   * Decodes UPI, URL, Wi-Fi, and raw text payloads without cloud reliance.
   * Scores 14 specific red flags: payee mismatch against shop sign (sticker swap), random/personal payee accounts, pre-filled amounts, unknown PSP handles, non-HTTPS protocols, link shorteners, punycode, brand imitation in subdomains, direct IP hosts, and KYC/OTP pressure words.
   * Produces an objective score (0–100) and strict verdict: **SAFE / CAUTION / DANGEROUS**.
2. **Gemma Explains (Open-Weight AI):**
   * **Google Gemma 4** (via Gemini API) translates the structured risk flags into plain English and a vernacular Bengali advisory line (*"বিপদ — এই QR ব্যবহার করবেন না..."*).
   * **Rule Integrity:** Gemma *explains* the verdict; it never decides it. Security remains 100% reproducible and immune to prompt injection.
   * **Scripted Fallback:** Works fully offline with zero internet access.
3. **Privacy by Design (Zero Sensitive Data Leaves the Device):**
   * Never stores or transmits raw QR payloads, full payee addresses, transaction amounts, or exact GPS coordinates.
   * Logs only privacy-scrubbed records: payload hash (FNV-1a), display name, category, coarse locality (e.g., *Rabindra Sarobar*), verdict, score, and masked payee (`rk***@paytm`).
4. **Community Registry (Snowflake Integration):**
   * Exports scrubbed logs as CSV directly formatted for Snowflake (`snowflake/schema.sql`).
   * Explored with **Snowflake CoCo** to detect fraud hotspots and scam clusters by neighbourhood.
5. **The Safe Trail Quest:**
   * Safe finds unlock a lightweight Gemma-generated exploration quest in West Bengal to reward community verification.

---

### Tracks Entered (Hacktoberfest Hack Day × OWASP JIS University)

* **Open-Source AI Challenge:**
  Open-weight AI (Gemma) powers user-friendly explanations and localized quests. Public MIT repository. Includes a standardized Agent Skill in `skills/qr-audit/SKILL.md`.
* **Google Gemma Challenge:**
  Utilizes Gemma 4 via the Gemini API with a deterministic offline fallback to guarantee street-level reliability even on flaky mobile networks.
* **Snowflake Challenge — Best Open-Source AI Project with Snowflake:**
  Meets all three required MLH elements:
  1. **Snowflake CoCo (Cortex Code):** Explored Snowflake Marketplace datasets and generated threat analytics views ([snowflake/COCO.md](snowflake/COCO.md)).
  2. **Freely Accessible Dataset in Snowflake:** Uses **Cybersyn: Point of Interest & Business Open Data** from Snowflake Marketplace ([Exploring Listings Guide](https://docs.snowflake.com/en/collaboration/consumer-listings-exploring)) alongside pre-loaded sample data ([Snowflake Sample Data Guide](https://docs.snowflake.com/en/user-guide/sample-data)).
  3. **Open-Weight AI Integration:** Cross-references community QR scans with Cybersyn POI to detect sticker-swap fraud (`V_STICKER_SWAP_ANOMALIES`) and feeds structured risk tiers (`V_GEMMA_AI_NEIGHBOURHOOD_BRIEF`) into **Google Gemma 4** for localized vernacular security briefs.
  - Complete schema DDL: [snowflake/schema.sql](snowflake/schema.sql)
  - Executable data pipeline: [snowflake/pipeline.js](snowflake/pipeline.js) & [snowflake/pipeline.py](snowflake/pipeline.py)
  - Official Cortex Code tooling: [Cortex Code Portal](https://signup.snowflake.com/cortex-code/) & [Docs](https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code)
* **AI in Cybersecurity (OWASP JIS University):**
  - **Attack:** QR Sticker swap (UPI redirection) & Phishing QR (KYC credential harvesting).
  - **Vulnerability:** Blind trust in opaque barcodes; payment apps reveal payees only *inside* the transaction flow.
  - **Security Control:** Client-side deterministic decoding + 14-rule risk heuristic + Zero-PII sanitization + Vernacular AI explanations.
  - **Result:** Pre-transaction verdict before money or credentials move.

---

### How to Run

**No build step, no dependencies, no installation needed.**

#### Option A: Direct Open
Double-click `index.html` in any modern web browser.

#### Option B: Local HTTP Server
```bash
# Python 3
python -m http.server 8000

# Or Node.js
npx serve .

# Visit in browser:
http://localhost:8000
```

Ways to audit a QR:
1. **Upload QR Image:** Click **Upload QR image** or **📷 Upload Image**, drop any image or screenshot onto the input box, or paste directly from clipboard (`Ctrl+V`).
2. **Scan with Camera:** Tap **Scan with camera** for live real-time detection (BarcodeDetector / jsQR fallback).
3. **Street Samples:** Click any of the three quick scenarios (`Safe shop UPI`, `Sticker-swap UPI`, `Phishing link QR`).
4. **Paste Text:** Paste raw `upi://` or `http://` URLs into the payload textarea.

**Live Gemma Mode (Optional):**
Copy `config.example.js` to `config.js` and add your Google AI Studio API key and Gemma model name. Without it, the built-in offline fallback runs seamlessly.

---

### Tests

Run the built-in Node test suite:
```bash
node --test tests/rules.test.mjs
```

Covers 8 core automated security & AI assertions:
- Safe merchant UPI returns `SAFE`
- Sticker swap returns `DANGEROUS` (name mismatch + random payee + pre-filled amount)
- Phishing link returns `DANGEROUS` (insecure HTTP + brand spoofing + pressure keywords)
- Scrubbed registry row never contains raw payee or raw payload
- Payee masking properly conceals sensitive handles
- Shortened URLs trigger risk warnings
- EMVCo BharatQR merchant code (Techno Main Salt Lake) returns `SAFE` and verifies registered business entity
- Open-weight AI model evaluation harness (`harness/eval_harness.mjs`) validates 16/16 safety alignment & vernacular token checks with 100% pass rate

---

### Technologies

* **Frontend:** Vanilla HTML5, CSS3, modern JavaScript (ES6+), zero frameworks.
* **Security Engine:** Local deterministic heuristic analyzer (`js/rules.js`).
* **AI Model:** Google Gemma 4 (open-weight, accessed via Gemini API / offline fallback).
* **Data & Analytics:** Snowflake Cloud Data Warehouse + Snowflake CoCo.
* **Agent Integration:** Agent Skill Open Standard specification (`skills/qr-audit/SKILL.md`).

---

### Limitations

* **No Ultimate Legal Ownership Guarantee:** A `SAFE` verdict indicates "no known red flags detected" rather than absolute legal backing. Users must verify the payee name in their UPI app prior to confirming.
* **Zero-Day Phishing Domains:** Freshly registered phishing domains without suspicious keywords or brand imitations may not trigger domain heuristics.
* **Camera API Support:** Live camera scanning relies on browser `BarcodeDetector` support; input pasting and sample buttons work universally.

---

# Section 2: Team Information

### 👥 Team Name: **Team Raksha**

| Member Name | Role / Focus | College / Institute | Year & Department |
| :--- | :--- | :--- | :--- |
| **Sudipta Sanki** | Security Architecture & Deterministic Engine | Techno Main Salt Lake (TMSL) | 2nd Year, CSE |
| **Soumyabrata Mukherjee** | AI Integration & Gemma Explanations | Techno Main Salt Lake (TMSL) | 2nd Year, CSE |
| **Debangshu Sinha** | Full-Stack Interface, Registry & Snowflake | Techno Main Salt Lake (TMSL) | 2nd Year, CSE |

* **Event:** Hacktoberfest Hack Day × OWASP JIS University, Kolkata
* **Date:** Thursday, 8 October 2026
* **Institution:** Techno Main Salt Lake (TMSL), Kolkata, West Bengal

---

# Section 3: Open-Source License & Disclosures

### Open-Source License
This project is licensed under the terms of the **MIT License**. A complete copy of the license is included in [`LICENSE`](LICENSE).

```text
MIT License

Copyright (c) 2026 Sudipta Sanki, Soumyabrata Mukherjee, Debangshu Sinha (Team Raksha)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

### MLH & Hackathon AI Assistance Disclosure
In strict adherence to MLH Code of Conduct and Hackathon guidelines regarding AI-assisted development tools:
* **Coding Assistants:** GitHub Copilot and Google Antigravity were utilized as AI pair-programming and developer-assistance tools for boilerplate generation and test scaffolding.
* **Project AI Component:** Google Gemma 4 (open-weight AI) is used within the application runtime solely for translating technical security findings into accessible plain English and Bengali language guidance and generating non-critical exploration quests. All core security decisions are executed deterministically.
