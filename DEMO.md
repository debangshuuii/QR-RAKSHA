# 3-minute demo script

**Problem (30s)** — "Kolkata runs on QR codes. One sticker pasted over a
shop's real code and you pay a scammer — or a 'KYC verify' QR takes you to
a phishing site. You can't see where a QR goes until it's too late."

**Solution (20s)** — "TrailQR Raksha checks a QR before you pay. The rules
decide. Gemma explains. Nothing sensitive leaves your phone unsanitised."

**Demo (90s)** — use the three sample buttons, in order:
1. **Safe shop UPI** → SAFE 0/100, payee matches the sign, Gemma quest unlocks.
2. **Sticker-swap UPI** → DANGEROUS. Same shop name on the sign, but the QR
   pays a random personal account, name mismatch, amount pre-filled.
   Gemma explains it in plain language (+ Bengali line). Tap **Report**.
3. **Phishing link QR** → DANGEROUS. http, brand in a fake domain, KYC
   pressure words. Show the registry: only a hash, coarse area and masked
   payee were stored — **not** the raw QR.

**Technical (20s)** — "Deterministic rule engine, open-source, tested.
Gemma 4 via the Gemini API explains structured flags — it never decides.
Scrubbed registry exports to Snowflake; we explored it with CoCo
(show screenshot). Agent skill in the repo follows the Agent Skill format."

**Limitations (20s)** — say them before a judge asks: "We can't verify
the ultimate owner of a UPI ID, and a brand-new phishing domain may raise
no flags. SAFE means no known red flags — you still check the name in
your payment app."

**Cyber frame if an OWASP judge probes:** Attack = sticker swap / phishing
QR · Vulnerability = invisible destination · Control = local decode +
rules + data minimisation · Result = verdict before money moves.
