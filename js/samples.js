/* Three sample QR payloads — the demo must never depend on live scanning. */
window.TRAILQR_SAMPLES = [
  {
    id: "safe-upi",
    label: "1 · Safe shop UPI — Rabindra Sarobar",
    payload: "upi://pay?pa=chaidukaan@okhdfcbank&pn=Chai%20Dukaan&cu=INR",
    expectedName: "Chai Dukaan",
    area: "Rabindra Sarobar, Kolkata",
    place: "Rabindra Sarobar"
  },
  {
    id: "swapped-upi",
    label: "2 · Sticker-swap UPI — same shop, wrong payee",
    payload: "upi://pay?pa=rk8492017365@paytm&pn=Quick%20Collection%20Point&cu=INR&am=499",
    expectedName: "Chai Dukaan",
    area: "Rabindra Sarobar, Kolkata",
    place: "Rabindra Sarobar"
  },
  {
    id: "phishing-url",
    label: "3 · Phishing link QR — 'KYC verify' sticker",
    payload: "http://paytm.kyc-verify-login.ru/secure/upi-update",
    expectedName: "",
    area: "Park Street, Kolkata",
    place: "Park Street"
  }
];
