/*
 * TrailQR Raksha — deterministic QR risk rules.
 * The rules decide the verdict. AI (Gemma) only explains it afterwards.
 * No network, no dependencies. Works in the browser and in Node tests.
 */
(function (global) {
  "use strict";

  var SHORTENERS = ["bit.ly","tinyurl.com","t.co","goo.gl","rb.gy","cutt.ly","shorturl.at","is.gd","buff.ly","ow.ly","s.id"];
  var BRANDS = ["paytm","googlepay","gpay","phonepe","bhim","sbi","hdfc","icici","axis","upi","npci"];
  var OFFICIAL = ["paytm.com","phonepe.com","sbi.co.in","hdfcbank.com","icicibank.com","axisbank.com","npci.org.in","bhimupi.org.in"];
  var KNOWN_PSP = ["okhdfcbank","okicici","okaxis","oksbi","paytm","ybl","ibl","axl","sbi","upi","apl","okbizaxis","rapl","mahb","kotak","barodampay","cnrb","idfcfirst","federal","indus","yesbank","payzapp","freecharge","amazonpay","axisbank","pingpay","pnb","allbank","centralbank","unionbank","uco"];
  var SUSPICIOUS_WORDS = ["verify","kyc","login","secure","update","refund","claim","prize","winner","otp","password","account-blocked","re-activate","reactivate"];

  var MCC_MAP = {
    "8299": "Educational Services",
    "8211": "Schools (Elementary & Secondary)",
    "8220": "Colleges & Universities",
    "5411": "Grocery Stores & Supermarkets",
    "5499": "Misc Food Stores",
    "5812": "Restaurants & Eating Places",
    "5814": "Fast Food & Tea Stalls",
    "5912": "Drug Stores & Pharmacies",
    "5541": "Service Stations & Fuel",
    "4121": "Taxicabs & Rides",
    "5311": "Department Stores"
  };

  function parseEMVCo(text) {
    if (!text || text.slice(0, 6) !== "000201") return null;
    var tlv = {};
    var i = 0;
    while (i < text.length) {
      var tag = text.slice(i, i + 2);
      var len = parseInt(text.slice(i + 2, i + 4), 10);
      if (isNaN(len) || i + 4 + len > text.length) break;
      var val = text.slice(i + 4, i + 4 + len);
      tlv[tag] = val;
      i += 4 + len;
    }
    return tlv;
  }

  function extractVPAFromEMVCo(tlv) {
    var candidateTags = ["26", "27", "28", "29", "30", "31"];
    for (var k = 0; k < candidateTags.length; k++) {
      var str = tlv[candidateTags[k]];
      if (!str || str.indexOf("@") === -1) continue;
      var at = str.indexOf("@");
      var after = str.slice(at + 1).split(/[^a-zA-Z0-9]/)[0];
      var before = str.slice(0, at);
      var match = before.match(/([a-zA-Z0-9][a-zA-Z0-9._-]*)$/);
      if (match) {
        var candidate = match[1];
        if (candidate.indexOf("A00000052401") !== -1) {
          candidate = candidate.slice(candidate.indexOf("A00000052401") + 12).replace(/^\d{1,2}/, "");
        }
        return candidate + "@" + after;
      }
    }
    return "";
  }

  function norm(s) { return (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
  function tokens(s) { return norm(s).split(" ").filter(function (t) { return t.length > 2; }); }

  function fnv1a(str) {
    var h1 = 0x811c9dc5, h2 = 0x01000193 ^ 0x9e3779b9;
    for (var i = 0; i < str.length; i++) {
      h1 ^= str.charCodeAt(i); h1 = Math.imul(h1, 0x01000193) >>> 0;
      h2 ^= (str.charCodeAt(i) + i); h2 = Math.imul(h2, 0x811c9dc5) >>> 0;
    }
    return ("0000000" + h1.toString(16)).slice(-8) + ("0000000" + h2.toString(16)).slice(-8);
  }

  function maskPayee(pa) {
    if (!pa || pa.indexOf("@") === -1) return pa || "";
    var parts = pa.split("@");
    var local = parts[0];
    var shown = local.length <= 2 ? local.charAt(0) + "*" : local.slice(0, 2) + "***";
    return shown + "@" + parts[1];
  }

  function coarseArea(area) {
    // Keep only the neighbourhood/place name the user typed — never exact GPS.
    return (area || "Unknown area").split(",")[0].trim().slice(0, 60);
  }

  function parsePayload(raw) {
    var text = (raw || "").trim();
    if (text.slice(0, 6) === "000201") {
      var tlv = parseEMVCo(text);
      if (tlv) {
        var merchantName = (tlv["59"] || "").trim();
        var vpa = extractVPAFromEMVCo(tlv);
        var city = (tlv["60"] || "").trim();
        var pin = (tlv["61"] || "").trim();
        var mcc = (tlv["52"] || "").trim();
        var am = (tlv["54"] || "").trim();
        var cu = (tlv["53"] || "356").trim();
        var categoryDesc = MCC_MAP[mcc] || (mcc ? ("Merchant MCC " + mcc) : "Registered Business Merchant");
        return {
          kind: "upi_merchant",
          raw: text,
          pa: vpa,
          pn: merchantName || "Registered Business Merchant",
          merchantName: merchantName,
          city: city,
          pin: pin,
          mcc: mcc,
          category: categoryDesc,
          am: am,
          cu: cu,
          isBusiness: true
        };
      }
    }
    if (/^upi:/i.test(text)) {
      var q = text.split("?")[1] || "";
      var params = {};
      q.split("&").forEach(function (pair) {
        var kv = pair.split("=");
        if (kv.length >= 2) {
          try { params[kv[0].toLowerCase()] = decodeURIComponent(kv.slice(1).join("=").replace(/\+/g, " ")); }
          catch (e) { params[kv[0].toLowerCase()] = kv.slice(1).join("="); }
        }
      });
      return { kind: "upi", raw: text, pa: params.pa || "", pn: params.pn || "", am: params.am || "", cu: params.cu || "" };
    }
    if (/^https?:\/\//i.test(text) || /^www\./i.test(text)) {
      var url = null;
      try { url = new URL(/^www\./i.test(text) ? "https://" + text : text); } catch (e) { url = null; }
      return { kind: "url", raw: text, url: url, protocol: url ? url.protocol : "", host: url ? url.hostname.toLowerCase() : "" };
    }
    if (/^WIFI:/i.test(text)) return { kind: "wifi", raw: text };
    return { kind: "text", raw: text };
  }

  function analyse(raw, expectedName, area) {
    var p = parsePayload(raw);
    var flags = [];
    function flag(code, severity, points, detail) { flags.push({ code: code, severity: severity, points: points, detail: detail }); }

    var displayName = "", masked = "";

    if (p.kind === "upi_merchant") {
      displayName = p.pn;
      masked = maskPayee(p.pa);
      if (expectedName && p.pn) {
        var exp = tokens(expectedName), got = tokens(p.pn);
        var overlap = exp.some(function (t) { return got.indexOf(t) !== -1; });
        if (!overlap) {
          flag("NAME_MISMATCH", "high", 45, "Name on the sign/shop is '" + expectedName + "' but the QR pays registered business '" + p.pn + "'. Classic sticker-swap sign.");
        }
      }
      if (p.am) {
        flag("PREFILLED_AMOUNT", "low", 10, "Amount is pre-filled by the QR (₹" + p.am + "). Check it before confirming.");
      }
      var handle = (p.pa.split("@")[1] || "").toLowerCase();
      if (handle && KNOWN_PSP.indexOf(handle) === -1) {
        flag("UPI_UNKNOWN_HANDLE", "low", 10, "Payee bank handle '@" + handle + "' is not in the primary list.");
      }
    }

    if (p.kind === "upi") {
      displayName = p.pn || "(no payee name in QR)";
      masked = maskPayee(p.pa);
      if (!p.pa || p.pa.indexOf("@") === -1) flag("UPI_NO_PAYEE", "high", 50, "UPI QR has no valid payee address (pa). Do not pay.");
      var handle = (p.pa.split("@")[1] || "").toLowerCase();
      if (handle && KNOWN_PSP.indexOf(handle) === -1) flag("UPI_UNKNOWN_HANDLE", "medium", 20, "Payee bank/app handle '@" + handle + "' is not a well-known payment provider handle.");
      var local = (p.pa.split("@")[0] || "");
      if (/\d{6,}/.test(local)) flag("UPI_RANDOM_PAYEE", "medium", 20, "Payee address looks like a personal/random account (" + masked + "), not a business account.");
      if (expectedName && p.pn) {
        var exp = tokens(expectedName), got = tokens(p.pn);
        var overlap = exp.some(function (t) { return got.indexOf(t) !== -1; });
        if (!overlap) flag("NAME_MISMATCH", "high", 45, "Name on the sign/shop is '" + expectedName + "' but the QR pays '" + p.pn + "'. Classic sticker-swap sign.");
      }
      if (p.am) flag("PREFILLED_AMOUNT", "low", 10, "Amount is pre-filled by the QR (₹" + p.am + "). Check it before you confirm — you should type the amount yourself.");
    }

    if (p.kind === "url" && p.url) {
      displayName = p.host;
      if (p.protocol === "http:") flag("HTTP_NOT_HTTPS", "high", 30, "Link uses http, not https — traffic can be intercepted or redirected.");
      if (/^\d+\.\d+\.\d+\.\d+$/.test(p.host)) flag("IP_HOST", "high", 35, "Link goes straight to an IP address instead of a named website.");
      if (p.host.indexOf("xn--") !== -1) flag("PUNYCODE", "high", 35, "Punycode domain (xn--) — often used to imitate a real brand with lookalike letters.");
      if (SHORTENERS.indexOf(p.host) !== -1) flag("SHORTENER", "medium", 25, "Shortened link (" + p.host + ") hides the real destination.");
      if (p.raw.indexOf("@") > p.raw.indexOf("://") + 2 && p.raw.split("@").length > 1 && p.kind === "url" && p.raw.indexOf("@") < p.raw.indexOf("/", p.raw.indexOf("://") + 3)) {
        flag("AT_IN_URL", "high", 30, "URL contains '@' before the host — the part before @ is a decoy, the real site is after it.");
      }
      BRANDS.forEach(function (b) {
        if (p.host.indexOf(b) !== -1 && OFFICIAL.indexOf(p.host) === -1 && !p.host.endsWith("." + b + ".com")) {
          var official = OFFICIAL.some(function (o) { return p.host === o || p.host.endsWith("." + o); });
          if (!official) flag("BRAND_IN_HOST", "high", 35, "Domain '" + p.host + "' contains the brand '" + b + "' but is not that brand's official domain.");
        }
      });
      var hay = (p.host + " " + p.url.pathname).toLowerCase();
      SUSPICIOUS_WORDS.forEach(function (w) {
        if (hay.indexOf(w) !== -1) flag("SUSPICIOUS_WORD_" + w.toUpperCase().replace(/[^A-Z]/g, ""), "medium", 15, "Link uses pressure/credential word '" + w + "' — banks and UPI apps do not ask for KYC/OTP via QR links.");
      });
      if ((p.host.match(/\./g) || []).length >= 3) flag("DEEP_SUBDOMAIN", "low", 10, "Very long subdomain chain — often used to bury the real domain at the end.");
    }

    if (p.kind === "wifi") flag("WIFI_QR", "medium", 20, "Wi-Fi QR — only join networks you recognise; a rogue hotspot can intercept traffic.");
    if (p.kind === "text") {
      var low = p.raw.toLowerCase();
      if (low.indexOf("otp") !== -1 || low.indexOf("password") !== -1 || low.indexOf("pin") !== -1) {
        flag("ASKS_SECRET", "high", 45, "QR content mentions OTP/password/PIN. No legitimate payment QR ever asks for these.");
      } else {
        flag("PLAIN_TEXT", "low", 5, "Plain-text QR (not a payment or link). Low risk, but read it before acting on it.");
      }
      displayName = p.raw.slice(0, 40);
    }
    if (!p.raw) flag("EMPTY", "high", 50, "Empty QR payload — nothing to verify.");

    var score = flags.reduce(function (a, f) { return a + f.points; }, 0);
    if (score > 100) score = 100;
    var verdict = score >= 55 ? "DANGEROUS" : score >= 25 ? "CAUTION" : "SAFE";

    return {
      kind: p.kind,
      displayName: displayName,
      maskedPayee: masked,
      merchantCategory: p.category || "",
      city: p.city || "",
      pin: p.pin || "",
      isBusiness: !!p.isBusiness,
      flags: flags,
      score: score,
      verdict: verdict,
      scrubbed: {
        qr_hash: fnv1a(p.raw),
        display_name: displayName,
        category: (p.kind === "upi" || p.kind === "upi_merchant") ? "upi" : p.kind,
        coarse_area: coarseArea(area || (p.city ? p.city + ", Kolkata" : "")),
        verdict: verdict,
        score: score,
        payee_masked: masked || null
      }
    };
  }

  var api = { analyse: analyse, parsePayload: parsePayload, maskPayee: maskPayee, fnv1a: fnv1a };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  global.TrailQR = api;
})(typeof window !== "undefined" ? window : globalThis);
