/*
 * Gemma layer — EXPLAINS a verdict the rules already decided, and (for safe
 * finds) generates a short quest. It never decides the verdict.
 *
 * Multilingual Support: English · Bengali (বাংলা) · Hindi (हिन्दी)
 *
 * Live mode: set window.TRAILQR_CONFIG = { GEMINI_API_KEY: "...", GEMMA_MODEL: "<model id from Google AI Studio>" }
 * in a local config.js (git-ignored). Without a key, a deterministic
 * scripted fallback runs — same input, same output, works fully offline.
 */
(function () {
  "use strict";

  var BN = {
    SAFE: "এই QR-টি নিয়ম অনুযায়ী নিরাপদ মনে হচ্ছে। তবু টাকা দেওয়ার আগে নামটা মিলিয়ে নিন।",
    CAUTION: "সাবধান — এই QR-এ কিছু সন্দেহজনক লক্ষণ আছে। এগোনোর আগে ভালো করে যাচাই করুন।",
    DANGEROUS: "বিপদ — এই QR ব্যবহার করবেন না। দোকানদারকে জানান এবং রিপোর্ট করুন।"
  };

  var HI = {
    SAFE: "यह QR नियमों के अनुसार सुरक्षित प्रतीत होता है। फिर भी भुगतान करने से पहले प्राप्तकर्ता का नाम अवश्य जांचें।",
    CAUTION: "सावधान — इस QR में कुछ संदिग्ध लक्षण पाए गए हैं। आगे बढ़ने से पहले पूरी तरह जांच करें।",
    DANGEROUS: "खतरा — इस QR का उपयोग न करें! तुरंत दुकानदार को सूचित करें और इसे रिपोर्ट करें।"
  };

  function getLang() {
    return (window.TrailQRI18n && window.TrailQRI18n.getLang()) || "en";
  }

  function fallbackExplain(result, place) {
    var lines = [];
    var lang = getLang();

    if (lang === "hi") {
      if (result.kind === "upi_merchant" && result.verdict === "SAFE") {
        lines.push("प्रमाणित आधिकारिक भारतक्यूआर व्यापार खाता: यह कोड " + (result.displayName || "एक वैध व्यापारी") + " का है।");
        lines.push("एनपीसीआई मानकों के तहत कोई स्टिकर-स्वैप विसंगति नहीं पाई गई है।");
      } else if (result.verdict === "SAFE") {
        lines.push("यह QR हमारे सभी सुरक्षा नियमों के तहत सुरक्षित है: व्यापारी का नाम मेल खाता है और कोई छिपा हुआ शुल्क नहीं है।");
      } else if (result.flags.length) {
        lines.push("इस QR को " + result.score + "/100 (" + result.verdict + ") स्कोर मिलने का कारण:");
        result.flags.forEach(function (f) { lines.push("• " + f.detail); });
        lines.push(result.verdict === "DANGEROUS"
          ? "इसे स्कैन या भुगतान न करें। दुकानदार को सूचित करें कि उनका असली QR कोड ढक दिया गया हो सकता है।"
          : "भुगतान करने से पहले दुकानदार से मौखिक पुष्टि अवश्य करें।");
      }
      lines.push("🛡️ " + HI[result.verdict]);
      return lines.join("\n");
    }

    if (lang === "bn") {
      if (result.kind === "upi_merchant" && result.verdict === "SAFE") {
        lines.push("যাচাইকৃত অফিসিয়াল ভারতকিউআর ব্যবসায়ী অ্যাকাউন্ট: এই কোডটি " + (result.displayName || "একজন আসল ব্যবসায়ীর") + "।");
        lines.push("এনপিসিআই ব্যাংকিং মান অনুযায়ী কোনো স্টিকার-সোয়াপ অসঙ্গতি পাওয়া যায়নি।");
      } else if (result.verdict === "SAFE") {
        lines.push("আমাদের সমস্ত চেকের অধীনে এই কিউআর নিরাপদ: প্রাপকের নাম মিলছে এবং কোনো অতিরিক্ত গোপন টাকা নেই।");
      } else if (result.flags.length) {
        lines.push("এই কিউআর কেন " + result.score + "/100 (" + result.verdict + ") স্কোর পেয়েছে:");
        result.flags.forEach(function (f) { lines.push("• " + f.detail); });
        lines.push(result.verdict === "DANGEROUS"
          ? "টাকা দেবেন না বা খুলবেন না। দোকানদারকে জানান যে আসল কিউআর স্টিকার ঢাকা হয়ে থাকতে পারে।"
          : "টাকা দেওয়ার আগে দোকানদারের সাথে ভালো করে মিলিয়ে নিন।");
      }
      lines.push("🛡️ " + BN[result.verdict]);
      return lines.join("\n");
    }

    // Default English with dual Bengali & Hindi vernacular footnotes
    if (result.kind === "upi_merchant" && result.verdict === "SAFE") {
      var details = [];
      if (result.displayName) details.push("official business name '" + result.displayName + "'");
      if (result.merchantCategory) details.push("merchant category '" + result.merchantCategory + "'");
      if (result.city) details.push("registered in " + result.city + (result.pin ? " PIN " + result.pin : ""));
      lines.push("Verified Official BharatQR Merchant Account: This code belongs to " + (result.displayName || "an authenticated business merchant") + " (" + details.join(", ") + ").");
      lines.push("The settlement VPA is legitimately issued by NPCI / banking standards, with no sticker-swap discrepancy detected.");
    } else if (result.verdict === "SAFE") {
      lines.push("This QR looks safe under our checks: the payee name matches, the payment handle is a known provider, and nothing is pre-filled or hidden.");
    } else if (result.flags.length) {
      lines.push("Here is why this QR scored " + result.score + "/100 (" + result.verdict + "):");
      result.flags.forEach(function (f) { lines.push("• " + f.detail); });
      lines.push(result.verdict === "DANGEROUS"
        ? "Do not pay or open this. Tell the shopkeeper — their original QR may have been covered — and tap Report."
        : "Pause and verify with the shopkeeper before paying. When in doubt, pay cash or type the shop's UPI ID yourself.");
    }
    lines.push("\n[বাংলা]: " + BN[result.verdict]);
    lines.push("[हिन्दी]: " + HI[result.verdict]);
    return lines.join("\n");
  }

  function fallbackQuest(result, place) {
    if (result.verdict !== "SAFE") return "";
    var p = place || result.scrubbed.coarse_area || "this spot in West Bengal";
    var lang = getLang();

    if (lang === "hi") {
      return "अन्वेषण क्वेस्ट अनलॉक — " + p + ": आपने " + p + " पर एक प्रमाणित सुरक्षित QR खोजा है। " +
        "जेम्मा की खोज टिप: इस स्थान के पास सबसे पुराने पेड़, दुकान या ऐतिहासिक स्थल को देखें और अगली बार किसी अन्य खोजी के लिए इसे सहेजें।";
    }
    if (lang === "bn") {
      return "অনুসন্ধান কোয়েস্ট আনলকড — " + p + ": আপনি " + p + "-এ একটি নিরাপদ যাচাইকৃত কিউআর খুঁজে পেয়েছেন। " +
        "জেমার ট্রেইল নোট: এই স্থানের নিকটতম প্রাচীন দোকান বা ঐতিহাসিক সাইনবোর্ডটি লক্ষ্য করুন এবং ট্রেইল সমৃদ্ধ করুন।";
    }

    return "Quest unlocked — " + p + ": You found a verified-safe QR at " + p +
      ". Gemma's trail note: look around for the oldest sign, tree or stall near this spot and note one detail a photo would miss. " +
      "Log it in the registry (scrubbed — no exact location, no payee details) to extend the West Bengal QR trail for the next explorer.";
  }

  async function explain(result, place) {
    var cfg = window.TRAILQR_CONFIG || {};
    var lang = getLang();
    var langInstruction = lang === "hi" ? "Explain in simple Hindi." : (lang === "bn" ? "Explain in simple Bengali." : "Explain in simple English with a short Bengali and Hindi advice line.");

    if (cfg.GEMINI_API_KEY && cfg.GEMMA_MODEL) {
      try {
        var prompt = "You are explaining a street QR safety verdict to a citizen in India. " +
          "Verdict: " + result.verdict + " (score " + result.score + "/100). " +
          "Flags: " + result.flags.map(function (f) { return f.detail; }).join(" ") +
          " " + langInstruction + " In 3 short sentences, explain the risk and what to do. Do not alter the verdict.";
        var res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(cfg.GEMMA_MODEL) + ":generateContent?key=" + encodeURIComponent(cfg.GEMINI_API_KEY), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!res.ok) throw new Error("Gemma API " + res.status);
        var data = await res.json();
        var text = data && data.candidates && data.candidates[0] && data.candidates[0].content &&
          data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
        if (text) return { text: text.trim(), mode: "gemma-live" };
      } catch (e) { /* fall through to scripted fallback */ }
    }
    return { text: fallbackExplain(result, place), mode: "scripted-fallback" };
  }

  window.TrailQRGemma = { explain: explain, quest: fallbackQuest, fallbackExplain: fallbackExplain };
})();
