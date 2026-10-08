# TrailQR Raksha — Project Description (Copy-Ready)

## One-liner
**TrailQR Raksha — Check a QR before you pay: privacy-first, offline-capable QR fraud detector for UPI sticker-swaps and phishing QRs.**

## Short Description (50 words — for forms / GitHub About)
TrailQR Raksha is a privacy-first, offline-capable QR security guard for street UPI payments in India. It decodes any QR locally, scores 14 red flags (payee mismatch, pre-filled amount, brand spoofing, KYC pressure), and gives a SAFE / CAUTION / DANGEROUS verdict with Bengali + Hindi explanations via Google Gemma 4.

## Detailed Description (Copy-paste for hackathon / submission)
Kolkata — and India — runs on QR codes. Tea stalls, taxis, parking, donations: you scan, you pay, you move on. One sticker pasted over a shop's real QR sends your payment to a scammer, or a "KYC verify" QR takes you to a phishing site. You cannot see where a QR goes until it is too late.

**TrailQR Raksha** is a privacy-first, offline-capable QR security guard built for street environments across West Bengal:

1. **Decode & Decide Locally:** Parses UPI (`upi://pay`), URL, Wi-Fi, EMVCo/BharatQR payloads with zero cloud dependency. 14-rule deterministic engine scores 0-100 → **SAFE / CAUTION / DANGEROUS**.
2. **Catches Real Attacks:** Sticker-swap (payee name mismatch vs shop sign, random/personal payee, pre-filled amount, unknown PSP), Phishing (non-HTTPS, link shorteners, punycode, brand-in-subdomain, direct IP, KYC/OTP pressure words).
3. **Gemma Explains, Rules Decide:** Google Gemma 4 translates flags into plain English + vernacular Bengali (`বাংলা`) + Hindi (`हिन्दी`). AI never overturns verdict — immune to prompt injection. Works fully offline with scripted fallback.
4. **Threat Map + Registry:** Interactive Leaflet map of danger zones vs verified safe stands. Zero-PII ledger (FNV-1a hash, coarse area, masked payee, score) — never raw payload or GPS.
5. **Snowflake CoCo Pipeline:** Queues RFC CSV for `snowflake/schema.sql`. Views `V_FRAUD_HOTSPOTS_BY_AREA`, `V_STICKER_SWAP_ANOMALIES` (vs Cybersyn POI Marketplace data), `V_GEMMA_AI_NEIGHBOURHOOD_BRIEF` feed Gemma briefs. Honest Standby mode — no fake dummy data.

**Run:** No build, no install. Double-click `index.html` or `python -m http.server 8000`. Upload image / scan camera / paste `upi://` / click street samples. Tests: `node --test tests/rules.test.mjs` (8/8 pass).

## Key Features (bullets)
- Triple-engine QR decode: `BarcodeDetector` + `jsQR` + `ZXing` with contrast + crop fallback
- 14-heuristic risk engine (`js/rules.js`) — reproducible, testable
- EN / বাংলা / हिन्दी switcher with Gemma vernacular debrief + Safe Trail Quest
- Live threat map with filters, search, Locate Me
- Zero-PII registry + CSV export for Snowflake
- Snowflake CoCo DDL + `pipeline.js/.py`
- Agent Skill (`skills/qr-audit/SKILL.md`) + eval harness (`harness/eval_harness.mjs` 16/16)

## Tech Stack
`Vanilla HTML5/CSS3/ES6+` · `js/rules.js` · `Google Gemma 4 (Gemini API + offline fallback)` · `Leaflet 1.9.4` · `Snowflake + CoCo + Cybersyn POI` · `Web Audio API` · `Node test runner`

## Tracks
- Open-Source AI Challenge
- Google Gemma Challenge
- Snowflake: Best Open-Source AI Project with Snowflake
- AI in Cybersecurity (OWASP JIS University)

## Team — Team Raksha, Techno Main Salt Lake (TMSL), Kolkata
- Sudipta Sanki — Security Architecture & Deterministic Engine
- Soumyabrata Mukherjee — AI Integration & Gemma Explanations
- Debangshu Sinha — Full-Stack Interface, Registry & Snowflake

MIT Licensed: https://github.com/debangshuuii/QR-RAKSHA
