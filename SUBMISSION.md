# 📝 Official Hackathon Submission Form

> **Event:** Hacktoberfest Hack Day × OWASP JIS University  
> **Repository:** [https://github.com/debangshuuii/QR-RAKSHA](https://github.com/debangshuuii/QR-RAKSHA)  
> **License:** MIT License (Permissive Open-Source)

---

## 📋 Required Submission Fields (Copy-Paste Ready)

### 1. Project Name
**TrailQR Raksha** (ট্রেইলকিউআর সুরক্ষা)

### 2. Team Name
**Team Raksha**

### 3. Team Members
1. **Sudipta Sanki** — 2nd Year, Computer Science & Engineering, Techno Main Salt Lake (TMSL), Kolkata
2. **Soumyabrata Mukherjee** — 2nd Year, Computer Science & Engineering, Techno Main Salt Lake (TMSL), Kolkata
3. **Debangshu Sinha** — 2nd Year, Computer Science & Engineering, Techno Main Salt Lake (TMSL), Kolkata

### 4. Challenge Track(s) Entered
1. **Open-Source AI Prize Challenge 🤖** *(Main Hack Day Challenge)*
2. **Google Gemma 🤍** *(Partner Challenge: Best Open-Source AI Project with Gemma)*
3. **Snowflake ❄️** *(Partner Challenge: Best Open-Source AI Project with Snowflake)*
4. **AI in Cybersecurity 🧑🏻💻** *(Local Challenge: OWASP JIS University)*

---

### 5. Project Description (Brief Summary & Problem Solved)
> Kolkata and India run on QR codes — tea stalls, taxis, campuses, and retail counters rely on instant UPI scanning. But 2D barcode matrices are visually opaque: victims cannot see the destination payee, domain, or pre-filled amounts before scanning. Scammers exploit this by pasting fraudulent QR stickers over legitimate shop counters (QR sticker-swap fraud) or planting lookalike "KYC Update / Refund" codes leading to credential phishing sites.
> 
> **TrailQR Raksha** is a privacy-first, offline-capable QR security defense guard designed for street micro-transactions:
> 1. **Deterministic Rules Decide:** A local 14-heuristic engine inspects payloads, merchant name mismatches, random payee accounts, pre-filled amounts, and brand spoofing before any money or credentials move.
> 2. **Gemma 4 Explains (Vernacular Bengali & Hindi):** Google Gemma 4 (open-weight AI) translates opaque technical findings into plain English, native Bengali (*"বিপদ — এই QR ব্যবহার করবেন না..."*), and Hindi (*"खतरा — इस QR का उपयोग न करें..."*).
> 3. **Interactive Street Threat Map:** Live visual threat map plotting reported sticker-swap red flags, phishing danger zones, and verified safe merchant stands across West Bengal.
> 4. **Snowflake CoCo Intelligence (Honest Standby Mode):** Zero-PII telemetry (FNV-1a cryptographic hashes, coarse localities, masked handles) is queued for Snowflake. Snowflake CoCo pipelines cross-reference scans against **Cybersyn: Point of Interest & Business Open Data** from Snowflake Marketplace to catch sticker-swap clusters and feed risk corridors back into Gemma 4 without fabricating dummy data.

---

### 6. GitHub Repository
**[https://github.com/debangshuuii/QR-RAKSHA](https://github.com/debangshuuii/QR-RAKSHA)** (Public, MIT Licensed)

### 7. Demo URL & Running Instructions
* **Local Web Demo:** Run locally via `http://localhost:8000` (or double-click `index.html` in any browser — zero build steps, zero npm installs required).
* **Terminal Test Suite:** `node --test tests/rules.test.mjs` (8/8 automated assertions passing).
* **AI Model Harness:** `node harness/eval_harness.mjs` (16/16 benchmarks passing with 100% rate).
* **Snowflake Pipeline:** `node snowflake/pipeline.js` (executes end-to-end data pipeline in under 1s).

---

### 8. Technologies & Frameworks Used
* **Frontend:** Vanilla HTML5, CSS3, modern JavaScript (ES6+), Web Audio API (tactile graphite feedback), zero external framework dependencies.
* **Barcode Decoders:** Triple-engine decoder: Native browser `BarcodeDetector` + `jsQR` + `ZXing-JS` (with contrast binarization & center-crop zooming).
* **Security & Heuristics:** Custom deterministic parser (`js/rules.js`) supporting UPI URLs and official NPCI / BharatQR / EMVCo `000201...` business merchant specifications.
* **Cloud Data Warehouse & Analytics:** Snowflake Cloud Data Warehouse, Snowflake Cortex Code (CoCo), Snowflake Marketplace Cybersyn POI dataset.
* **Agent Standards & Harnesses:** Agent Skill Open Standard specification (`skills/qr-audit/SKILL.md`), custom Node.js model evaluation harness (`harness/eval_harness.mjs`).

---

### 9. AI Model(s) Used & Exact Roles
* **Model:** **Google Gemma 4** (`gemma-4-it`) — Open-weight multimodal/language model.
* **Access Mode:** Accessed via Google AI Studio's Gemini API with a deterministic offline scripted fallback.
* **Exact Role in Project:**
  - Translates technical heuristic red flags into plain English and native vernacular Bengali warnings.
  - Generates educational civic exploration quests in West Bengal for verified clean merchant scans.
* **Separation of Concerns:** Deterministic rules *decide* the security verdict; Gemma *explains* and *correlates* it. The model is intentionally barred from overturning or softening verdicts, ensuring immunity from prompt injection and hallucination.
* **Developer AI Assistants:** Google Antigravity IDE, Snowflake Cortex Code (CoCo), GitHub Copilot (disclosed per MLH guidelines).

---

### 10. Documentation Assets Included in Repository
* **[README.md](README.md):** Full project documentation containing problem, 5-step architecture, installation, how to run, technology stack, limitations, team info, and MIT license.
* **[SKILLS.md](SKILLS.md):** Complete AI tools, open-weight models, workflows, agent skills, and evaluation harness documentation.
* **[TRACKS_VERIFICATION.md](TRACKS_VERIFICATION.md):** Evidence and proof dossier verifying 100% compliance across all 4 challenge tracks.
* **[SLIDES.md](SLIDES.md):** Slide-by-slide copy/paste presentation deck for Hacktoberfest opening slides.
* **[snowflake/COCO.md](snowflake/COCO.md):** Step-by-step transcript of Snowflake Cortex Code (CoCo) sessions, queries, and schema generation.
* **[snowflake/JUDGING.md](snowflake/JUDGING.md):** Direct answers to the exact questions Snowflake judges will ask.
* **[DEMO.md](DEMO.md):** 3-minute pitch and live demonstration script.
* **[LICENSE](LICENSE):** Permissive MIT Open-Source License.

---

## 🎯 Submission Readiness Checklist
- [x] All 10 required submission fields filled out completely.
- [x] README contains all minimum sections (problem, setup, run instructions, stack, AI models, limitations).
- [x] Public GitHub repo configured at `https://github.com/debangshuuii/QR-RAKSHA` with MIT license.
- [x] Open-weight AI (Gemma 4) clearly documented with exact role and boundary.
- [x] `SKILLS.md` included documenting AI tools, workflows, Agent Skill, and Model Harness.
- [x] 8/8 automated test assertions pass (`node --test tests/rules.test.mjs`).
- [x] No sensitive API keys committed (`config.js` is git-ignored, only `config.example.js` tracked).
