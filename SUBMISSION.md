# Submission — TrailQR Raksha (Hacktoberfest Hack Day × OWASP JIS University)

- **Project name:** TrailQR Raksha
- **Team name:** Team Raksha
- **Team members:** 
  1. Sudipta Sanki (Techno Main Salt Lake, 2nd Year, CSE)
  2. Soumyabrata Mukherjee (Techno Main Salt Lake, 2nd Year, CSE)
  3. Debangshu Sinha (Techno Main Salt Lake, 2nd Year, CSE)
- **Institution / College:** Techno Main Salt Lake (TMSL), Kolkata
- **Challenge tracks:** Open-Source AI · Google Gemma · Snowflake · OWASP — AI in Cybersecurity
- **Project description:** Kolkata runs on QR codes, and a single sticker swap can send your payment to a scammer. TrailQR Raksha checks any QR before you pay: a deterministic rule engine decodes it locally and scores sticker-swap, phishing and data-leak red flags; Gemma 4 explains the verdict in plain English and Bengali; only scrubbed data (hash, display name, coarse area, masked payee) goes to a community Snowflake registry where bad QRs can be reported; safe finds unlock a short Gemma quest exploring West Bengal.
- **GitHub repository:** https://github.com/debangshuuii/QR-RAKSHA
- **Demo URL:** Run locally (`http://localhost:8000`) or open `index.html` — zero dependencies, fully offline-capable.
- **Technologies used:** Vanilla HTML5 / CSS3 / JavaScript (ES6+), local deterministic security heuristic engine, Google Gemma 4 (via Gemini API / offline fallback), Snowflake + CoCo, Git/GitHub.
- **AI model(s) used:** Google Gemma 4 (open-weight) — risk explanations and safe-find quests only. Security verdicts are deterministic and reproducible without AI. GitHub Copilot and Google Antigravity used as coding assistants (disclosed per MLH guidelines).
- **README:** Included in repo (structured into 3 key sections: Project, Team Information, and MIT Open-Source License & Disclosures).

## Submission Readiness Checklist
- [x] Repo is configured for `https://github.com/debangshuuii/QR-RAKSHA` and README renders 3 distinct sections.
- [x] `node --test tests/rules.test.mjs` passes (6/6 tests passing).
- [x] Snowflake schema ready (`snowflake/schema.sql`) and CoCo exploration workflow ready (`snowflake/COCO.md`).
- [x] Team name, members, college, year, branch, and repo URL filled in.
- [x] No API key committed (`config.js` is git-ignored and only `config.example.js` is tracked).
