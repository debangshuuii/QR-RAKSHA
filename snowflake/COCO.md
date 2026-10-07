# Snowflake + CoCo — what to do at the venue (do the account part TONIGHT)

Eligibility for the Snowflake track needs **all three**: CoCo, a freely
accessible Snowflake dataset, and open-source/open-weight AI (Gemma, in this
project). Missing the CoCo step = ineligible, however good the app is.

## Tonight
1. Create a Snowflake trial account (snowflake.com — start trial).
2. Open Snowsight → run `schema.sql` to create `TRAILQR.REGISTRY.QR_REGISTRY`.
3. Screenshot Snowsight with the table created — this is your proof if venue wifi fails.

## At the venue / in Sprint 1
4. Open **CoCo** and use it to explore ONE freely accessible dataset:
   - In CoCo, ask: *"Show me freely accessible datasets in the Snowflake
     Marketplace related to places, businesses or cybersecurity threats."*
   - Pick one, let CoCo write the exploration queries, and **save/screenshot
     the CoCo prompt + the SQL it generated**. Put the screenshot in this repo
     (e.g. `snowflake/coco-exploration.png`) and link it from the README.
   - TODO (fill in at the venue): Dataset chosen: ______________ · CoCo prompt used: ______________
5. Load the app's registry CSV into `QR_REGISTRY` (steps in `schema.sql`),
   then ask CoCo: *"Which coarse_area has the most DANGEROUS verdicts in
   TRAILQR.REGISTRY.QR_REGISTRY?"* — screenshot the answer for the demo.

## Honesty rule for judges
If live Snowflake is unreachable during the demo, show the screenshots +
SQL and demo from the local registry. Say so plainly. Do not claim a live
connection you do not have.
