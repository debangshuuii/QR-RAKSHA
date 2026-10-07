---
name: qr-audit
description: Audit a decoded QR code payload for payment and phishing risk. Use when a user presents a QR code (UPI, URL, Wi-Fi or text) and needs a safety verdict before paying or opening it, or when logging a found QR to a scrubbed community registry.
---

# QR Audit Skill

## Instructions

1. Obtain the decoded QR payload as text. Never execute, open, or pay the
   payload while auditing it.
2. Run the deterministic rules in `js/rules.js` (`TrailQR.analyse`) with:
   - the payload,
   - the display name visible in the physical world (shop sign, poster),
   - the coarse area (neighbourhood only — never exact GPS).
3. Report the verdict exactly as the rules return it (SAFE / CAUTION /
   DANGEROUS) with every flag and its plain-language detail. Do not soften,
   override, or re-decide the verdict with a language model.
4. Use the language model only to explain the returned flags in simple
   language for a non-expert, and to suggest the next safe action.
5. When logging a find, store only the scrubbed row: payload hash, display
   name, category, coarse area, verdict, score, masked payee, report flag.
   Never store the raw payload, a full payee address, an amount, or an
   exact location.

## Limitations

- A SAFE verdict means "no known red flags", not "guaranteed legitimate".
  The auditor cannot verify the ultimate owner of a UPI ID.
- Brand-new phishing domains may raise no flags. Advise users to confirm
  the payee name inside their payment app before confirming any payment.
