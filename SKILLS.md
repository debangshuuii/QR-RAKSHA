# 🧠 AI Tools, Models & Agent Skills Documentation (`SKILLS.md`)

> **Project:** [TrailQR Raksha](https://github.com/debangshuuii/QR-RAKSHA)  
> **Repository:** Public Open-Source under MIT License  
> **Documentation Scope:** Compliance with MLH Submission Requirements for AI Tools, Models, Workflows, Agent Skills, and Model Harnesses.

---

## 🛠️ 1. AI Tools & Developer Assistants Used

In compliance with MLH Hackathon Guidelines regarding AI-assisted development tools:

| AI Tool / Agent | Developer / Platform | Primary Role in TrailQR Raksha |
| :--- | :--- | :--- |
| **Google Antigravity IDE** | Google DeepMind | AI pair-programming assistant used for code refactoring, test scaffolding, and cross-browser debugging. |
| **Snowflake CoCo (Cortex Code)** | Snowflake Inc. | Autonomous AI data coding agent used to discover Snowflake Marketplace datasets, write SQL schema DDL, and author the threat analytics pipeline ([`snowflake/COCO.md`](snowflake/COCO.md)). |
| **GitHub Copilot** | GitHub / OpenAI | Code auto-completion for boilerplate and type annotations. |

---

## 🤖 2. Open-Weight AI Models Used & Their Exact Roles

### Model: **Google Gemma 4** (`gemma-4-it`)
* **Category:** Open-Weights Multimodal / Language Model
* **Access Mode:** Accessed via Google AI Studio's Gemini API with a zero-network deterministic local fallback.
* **Exact Role in Runtime:**
  1. **Vernacular Security Translation:** Converts 14 technical heuristic red flags (e.g. `NAME_MISMATCH`, `BRAND_IN_HOST`, `PREFILLED_AMOUNT`) into plain, accessible English and native Bengali safety warnings (*"বিপদ — এই QR ব্যবহার করবেন না..."*).
  2. **Safe-Find Heritage Quests:** When a QR is verified clean (`SAFE 0/100`), Gemma generates a lightweight, educational civic quest celebrating local culture in West Bengal.
* **Architectural Safety Boundary (Separation of Concerns):**
  - **Deterministic Rules Decide:** The local heuristic engine in [`js/rules.js`](js/rules.js) makes 100% of the security verdicts (**SAFE / CAUTION / DANGEROUS**).
  - **Gemma Explains:** Gemma never overrides, softens, or decides verdicts. This guarantees zero hallucinations and complete immunity from prompt injection.
  - **Offline Resilience:** If API keys are missing or network connectivity drops on street mobile data, a built-in scripted fallback runs instantly with zero latency (< 1ms).

---

## 🧭 3. Project-Specific Workflows

The system follows a strict 4-stage pipeline:

```
[1. Street Physical Scan] ──► [2. Deterministic Rule Engine] ──► [3. Gemma 4 Vernacular Explainer]
                                         │
                              (Zero-PII Scrubbing)
                                         │
                                         ▼
                               [4. Snowflake CoCo Pipeline] ◄── [Cybersyn Marketplace POI Dataset]
                                         │
                                         ▼
                               [Neighborhood Hotspots & Sticker-Swap Anomaly Views]
```

1. **Local Physical Audit:** Citizen scans QR code via camera, image upload (drag-and-drop, clipboard screenshot paste), or text.
2. **Heuristic Evaluation:** 14 deterministic rules inspect payee addresses, protocols, domain entropy, and EMVCo tags.
3. **Vernacular AI Debrief:** Gemma 4 provides clear English and Bengali risk advice.
4. **Snowflake Threat Aggregation:** Zero-PII telemetry (FNV-1a hash, coarse locality, masked handle) is synced to Snowflake, where CoCo-generated views cross-reference Cybersyn verified merchants to catch sticker-swap clusters.

---

## 📦 4. Agent Skill Open Standard Compliance

TrailQR Raksha exposes a standardized agent skill in [`skills/qr-audit/SKILL.md`](skills/qr-audit/SKILL.md) following the **Agent Skill Open Standard**:

```yaml
---
name: qr-audit
description: Audit a decoded QR code payload for payment and phishing risk. Use when a user presents a QR code (UPI, URL, Wi-Fi or text) and needs a safety verdict before paying or opening it, or when logging a found QR to a scrubbed community registry.
---
```

### Operational Instructions for AI Agents:
1. **Never Execute Payloads:** Treat all raw QR strings as untrusted user input; never initiate payments or trigger HTTP requests automatically.
2. **Deterministic Precedence:** Always invoke `TrailQR.analyse(payload, shopName, locality)`. Respect returned verdict without model overrides.
3. **Data Minimization:** Ensure logged records contain only the scrubbed row (cryptographic hash, masked VPA, coarse area). Never store raw URLs, account numbers, or exact GPS coordinates.

---

## 🧪 5. AI Model Evaluation Harness (`harness/eval_harness.mjs`)

To ensure the open-weight AI model behaves safely and reproducibly, we implemented an original model evaluation harness:

* **Location:** [`harness/eval_harness.mjs`](harness/eval_harness.mjs)
* **Test Fixtures:** 4 representative scenarios (Authentic Tea Stall UPI, Sticker-Swap Attack, Phishing URL, Official BharatQR Merchant).
* **Automated Assertions (16 Checks):**
  1. **Verdict Alignment:** 100% agreement between model explanation and deterministic verdict.
  2. **Vernacular Fidelity:** Validates presence of correct Bengali tokens (`নিরাপদ`, `বিপদ`, `সাবধান`).
  3. **PII Non-Leakage:** Validates model outputs never leak raw unmasked VPAs or account numbers.
  4. **Latency SLA:** Edge execution completes in under 10ms.
* **Execution & Benchmark Report:**
  ```bash
  node harness/eval_harness.mjs
  ```
  Generates machine-readable results in [`harness/benchmark_report.json`](harness/benchmark_report.json). Fully integrated into CI test runner (`node --test tests/rules.test.mjs`).
