import { createRequire } from "node:module";
import test from "node:test";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const { analyse, maskPayee } = require("../js/rules.js");

test("safe shop UPI is SAFE", () => {
  const r = analyse("upi://pay?pa=chaidukaan@okhdfcbank&pn=Chai%20Dukaan&cu=INR", "Chai Dukaan", "Rabindra Sarobar, Kolkata");
  assert.equal(r.verdict, "SAFE");
  assert.equal(r.score, 0);
  assert.equal(r.maskedPayee, "ch***@okhdfcbank");
});

test("sticker-swap UPI is DANGEROUS (name mismatch + random personal payee + pre-filled amount)", () => {
  const r = analyse("upi://pay?pa=rk8492017365@paytm&pn=Quick%20Collection%20Point&cu=INR&am=499", "Chai Dukaan", "Rabindra Sarobar, Kolkata");
  assert.equal(r.verdict, "DANGEROUS");
  assert.ok(r.flags.some((f) => f.code === "NAME_MISMATCH"));
  assert.ok(r.flags.some((f) => f.code === "UPI_RANDOM_PAYEE"));
});

test("phishing URL is DANGEROUS (http + brand-in-host + suspicious words)", () => {
  const r = analyse("http://paytm.kyc-verify-login.ru/secure/upi-update", "", "Park Street, Kolkata");
  assert.equal(r.verdict, "DANGEROUS");
  assert.ok(r.flags.some((f) => f.code === "HTTP_NOT_HTTPS"));
  assert.ok(r.flags.some((f) => f.code === "BRAND_IN_HOST"));
});

test("scrubbed row never contains the raw payee or payload", () => {
  const r = analyse("upi://pay?pa=chaidukaan@okhdfcbank&pn=Chai%20Dukaan&cu=INR", "Chai Dukaan", "Rabindra Sarobar, Kolkata");
  const s = JSON.stringify(r.scrubbed);
  assert.ok(!s.includes("chaidukaan@okhdfcbank"));
  assert.ok(!s.includes("upi://"));
  assert.ok(r.scrubbed.qr_hash.length === 16);
});

test("maskPayee masks the local part", () => {
  assert.equal(maskPayee("ab@okaxis"), "a*@okaxis");
  assert.equal(maskPayee("shopname@ybl"), "sh***@ybl");
});

test("shortened https link is at least CAUTION", () => {
  const r = analyse("https://bit.ly/3AbCdEf", "", "Kolkata");
  assert.equal(r.verdict, "CAUTION");
});
