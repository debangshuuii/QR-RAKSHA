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
  },
  {
    id: "merchant-bharatqr",
    label: "4 · Official BharatQR — Techno Main Salt Lake",
    payload: "000201010211021646049010737005110415512260007370050061661000200737005220826UTIB000031992001003930764226460010A0000005240128MAB.037135003190033@AXISBANK27490010A000000524013103713500319003361000200737005225204829953033565802IN5920TECHNO MAIN SALTLAKE6007KOLKATA610670009162120708073700526304A9AD",
    expectedName: "Techno Main Saltlake",
    area: "Salt Lake Sector V, Kolkata",
    place: "Techno Main Salt Lake"
  }
];
