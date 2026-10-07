/*
 * Gemma layer — EXPLAINS a verdict the rules already decided, and (for safe
 * finds) generates a short quest. It never decides the verdict.
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

  function fallbackExplain(result, place) {
    var lines = [];
    if (result.verdict === "SAFE") {
      lines.push("This QR looks safe under our checks: the payee name matches, the payment handle is a known provider, and nothing is pre-filled or hidden.");
    } else if (result.flags.length) {
      lines.push("Here is why this QR scored " + result.score + "/100 (" + result.verdict + "):");
      result.flags.forEach(function (f) { lines.push("• " + f.detail); });
      lines.push(result.verdict === "DANGEROUS"
        ? "Do not pay or open this. Tell the shopkeeper — their original QR may have been covered — and tap Report."
        : "Pause and verify with the shopkeeper before paying. When in doubt, pay cash or type the shop's UPI ID yourself.");
    }
    lines.push(BN[result.verdict]);
    return lines.join("\n");
  }

  function fallbackQuest(result, place) {
    if (result.verdict !== "SAFE") return "";
    var p = place || result.scrubbed.coarse_area || "this spot in West Bengal";
    return "Quest unlocked — " + p + ": You found a verified-safe QR at " + p +
      ". Gemma's trail note: look around for the oldest sign, tree or stall near this spot and note one detail a photo would miss. " +
      "Log it in the registry (scrubbed — no exact location, no payee details) to extend the West Bengal QR trail for the next explorer.";
  }

  async function explain(result, place) {
    var cfg = window.TRAILQR_CONFIG || {};
    if (cfg.GEMINI_API_KEY && cfg.GEMMA_MODEL) {
      try {
        var prompt = "You are explaining a QR safety verdict to a non-expert in Kolkata. " +
          "Verdict: " + result.verdict + " (score " + result.score + "/100). " +
          "Flags: " + result.flags.map(function (f) { return f.detail; }).join(" ") +
          " In 3 short sentences of simple English, explain the risk and what to do. Do not change the verdict.";
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
