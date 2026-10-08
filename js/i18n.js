/**
 * TrailQR Raksha — Internationalization (i18n) Engine
 * Native Vernacular Support: English (en) · Bengali (bn) · Hindi (hi)
 */
(function () {
  "use strict";

  var STORAGE_KEY = "trailqr_lang_pref";

  var TRANSLATIONS = {
    en: {
      brandSub: "Street QR Defense",
      navScanner: "Scan & Audit",
      navMap: "Threat Map",
      navRegistry: "Audit Registry",
      navSnowflake: "Snowflake Pipeline",
      navAbout: "About & Tracks",
      tagline: "Check any QR before you pay — engineered for street vendors, campuses, and daily micro-transactions.",
      shieldActive: "Shield Active",
      audioActive: "Audio Active",
      audioMuted: "Audio Muted",
      section1Num: "01",
      section1Title: "What are you scanning?",
      quickScenarios: "Quick Street Scenarios (Click to test):",
      scenarioSafe: "Safe shop UPI",
      scenarioSwap: "Sticker-swap UPI",
      scenarioPhish: "Phishing link QR",
      scenarioBharat: "Campus BharatQR",
      decodedQrLabel: "Decoded QR text",
      decodedQrHint: "(paste payload, upload QR image, or scan with camera)",
      dropOverlayText: "Drop QR image here to scan",
      uploadBtn: "📷 Upload Image",
      pasteBtn: "📋 Paste Clipboard",
      clearBtn: "🧹 Clear",
      expectedLabel: "What name is on the shop / sign?",
      expectedHint: "(catches sticker swaps)",
      expectedPlaceholder: "e.g. Chai Dukaan",
      areaLabel: "Area / Neighbourhood",
      areaHint: "(coarse locality only — never exact GPS)",
      areaPlaceholder: "e.g. Rabindra Sarobar, Kolkata",
      checkQrBtn: "Check this QR",
      uploadQrBtn: "Upload QR image",
      scanCameraBtn: "Scan with camera",
      threatScoreTitle: "THREAT RISK SCORE",
      redFlagsTitle: "Deterministic Heuristic Red Flags:",
      gemmaTitle: "Gemma AI Vernacular Debrief",
      questTitle: "Trail Quest Unlocked",
      reportBtn: "Report this QR Fraud",
      saveSafeBtn: "Add scrubbed find to registry",
      zeroPiiNote: "Zero-PII Guarantee: Only a scrubbed row is logged — cryptographic FNV-1a hash, coarse neighborhood, score, and masked payee. Never raw payloads, accounts, or exact GPS.",
      mapTitle: "Global & Street Threat Map",
      mapHint: "Interactive visual map displaying reported QR red flags, danger zones, and verified merchant stands.",
      filterAll: "All Locations",
      filterDanger: "🔴 Red Flags Only",
      filterSafe: "🟢 Safe Spots Only",
      mapLegendDanger: "Reported Sticker Swap / Phishing",
      mapLegendSafe: "Verified Authentic Merchant",
      registryTitle: "Community Audit Registry",
      registryHint: "Local zero-PII audit ledger queued for Snowflake export",
      clearRegistryBtn: "🧹 Clear Registry",
      exportCsvBtn: "Export CSV for Snowflake",
      registryEmptyText: "No audits recorded yet. Scan or test a QR code in the Scanner to log your first verified audit.",
      snowflakeTitle: "Snowflake CoCo Pipeline & Sync Status",
      snowflakeStatusTitle: "Snowflake Cloud Sync Status:",
      snowflakeStatusStandby: "🟡 Standby / Local Queue Mode",
      snowflakeStatusDesc: "No active Snowflake account connected. Cloud sync is in offline queue mode to preserve data integrity. We do not inject fake cloud data. Telemetry is saved locally in zero-PII RFC CSV format, ready for ingestion via snowflake/schema.sql when your account is configured.",
      howToConnect: "How to connect a Snowflake Trial account:",
      step1: "1. Create a free trial account at signup.snowflake.com",
      step2: "2. Execute snowflake/schema.sql in Snowsight to create TRAILQR database and views",
      step3: "3. Run node snowflake/pipeline.js or set environment variables to stream real telemetry",
      tabHotspots: "📍 Locality Hotspots",
      tabAnomalies: "🛡️ Sticker-Swap Anomalies",
      tabGemmaFeed: "🤖 Gemma AI Corridors",
      tabSqlDdl: "📜 CoCo SQL DDL",
      statAudits: "Audits Logged",
      statThreats: "Scams Blocked",
      statSafe: "Safe Payees",
      privacy100: "100% Client-Side"
    },

    bn: {
      brandSub: "কিউআর সুরক্ষা কবচ",
      navScanner: "স্ক্যানার ও অডিট",
      navMap: "হুমকি মানচিত্র",
      navRegistry: "অডিট রেজিস্ট্রি",
      navSnowflake: "স্নোফ্লেক পাইপলাইন",
      navAbout: "প্রতিরক্ষা ও ট্র্যাকস",
      tagline: "টাকা দেওয়ার আগে যেকোনো কিউআর যাচাই করুন — চায়ের দোকান, ক্যাম্পাস ও রাজপথের লেনদেনের জন্য নির্মিত।",
      shieldActive: "কবচ সক্রিয়",
      audioActive: "শব্দ সক্রিয়",
      audioMuted: "শব্দ নিঃশব্দ",
      section1Num: "০১",
      section1Title: "আপনি কী স্ক্যান করছেন?",
      quickScenarios: "সাধারণ রাস্তার দৃশ্যকল্প (পরীক্ষা করতে ক্লিক করুন):",
      scenarioSafe: "নিরাপদ চায়ের দোকান",
      scenarioSwap: "স্টিকার-সোয়াপ জালিয়াতি",
      scenarioPhish: "ফিশিং লিংক কিউআর",
      scenarioBharat: "ক্যাম্পাস ভারতকিউআর",
      decodedQrLabel: "ডিকোড করা কিউআর টেক্সট",
      decodedQrHint: "(পে-লোড পেস্ট করুন, ছবি আপলোড করুন বা ক্যামেরা দিয়ে স্ক্যান করুন)",
      dropOverlayText: "স্ক্যান করতে কিউআর ছবি এখানে ফেলুন",
      uploadBtn: "📷 ছবি আপলোড",
      pasteBtn: "📋 ক্লিপবোর্ড পেস্ট",
      clearBtn: "🧹 মুছে ফেলুন",
      expectedLabel: "দোকানের সাইনবোর্ডে কী নাম আছে?",
      expectedHint: "(স্টিকার বদল সনাক্ত করে)",
      expectedPlaceholder: "যেমন: চায়ের দোকান",
      areaLabel: "এলাকা / পাড়া",
      areaHint: "(কেবলমাত্র সাধারণ এলাকা — কখনও সুনির্দিষ্ট জিপিএস নয়)",
      areaPlaceholder: "যেমন: রবীন্দ্র সরোবর, কলকাতা",
      checkQrBtn: "এই কিউআর যাচাই করুন",
      uploadQrBtn: "ছবি আপলোড করুন",
      scanCameraBtn: "ক্যামেরা দিয়ে স্ক্যান",
      threatScoreTitle: "হুমকি ঝুঁকি স্কোর",
      redFlagsTitle: "নিয়মভিত্তিক সতর্কতার লক্ষণ:",
      gemmaTitle: "জেমা এআই মাতৃভাষা ব্যাখ্যা",
      questTitle: "অনুসন্ধান কোয়েস্ট আনলকড",
      reportBtn: "প্রতারক কিউআর রিপোর্ট করুন",
      saveSafeBtn: "নিরাপদ কিউআর সেভ করুন",
      zeroPiiNote: "গোপনীয়তার গ্যারান্টি: কেবল সুরক্ষিত স্ক্রাবড তথ্য সংরক্ষিত হয় — ক্রিপ্টোগ্রাফিক হ্যাশ, এলাকা ও মুখোশযুক্ত আইডি। আসল অ্যাকাউন্ট বা জিপিএস কখনোই সংরক্ষণ করা হয় না।",
      mapTitle: "গ্লোবাল ও পথ হুমকি মানচিত্র",
      mapHint: "রিপোর্ট করা কিউআর লাল সংকেত, বিপদ অঞ্চল এবং যাচাইকৃত নিরাপদ দোকানের ইন্টারঅ্যাক্টিভ মানচিত্র।",
      filterAll: "সব অবস্থান",
      filterDanger: "🔴 বিপদ সংকেত কেবল",
      filterSafe: "🟢 নিরাপদ দোকান কেবল",
      mapLegendDanger: "নথিভুক্ত স্টিকার-সোয়াপ / ফিশিং এলাকা",
      mapLegendSafe: "যাচাইকৃত আসল ব্যবসায়ী",
      registryTitle: "কমিউনিটি অডিট রেজিস্ট্রি",
      registryHint: "স্নোফ্লেক এক্সপোর্টের জন্য স্থানীয় জিরো-পিআইআই অডিট লেজার",
      clearRegistryBtn: "🧹 রেজিস্ট্রি পরিষ্কার করুন",
      exportCsvBtn: "স্নোফ্লেকের জন্য CSV এক্সপোর্ট",
      registryEmptyText: "এখনও কোনো অডিট রেকর্ড করা হয়নি। প্রথম অডিট রেকর্ড করতে স্ক্যানারে একটি কিউআর পরীক্ষা করুন।",
      snowflakeTitle: "স্নোফ্লেক পাইপলাইন ও সিঙ্ক স্ট্যাটাস",
      snowflakeStatusTitle: "স্নোফ্লেক ক্লাউড সিঙ্ক স্ট্যাটাস:",
      snowflakeStatusStandby: "🟡 স্ট্যান্ডবাই / স্থানীয় কিউ মোড",
      snowflakeStatusDesc: "কোনো সক্রিয় স্নোফ্লেক অ্যাকাউন্ট যুক্ত করা নেই। তথ্যের সত্যতা রক্ষার্থে ক্লাউড সিঙ্ক অফলাইন কিউতে রয়েছে। আমরা কোনো কৃত্রিম ডামি ডেটা দেখাই না। আপনার অ্যাকাউন্ট সেটআপ হলে snowflake/schema.sql দিয়ে আসল ডেটা লোড করা যাবে।",
      howToConnect: "কীভাবে আপনার স্নোফ্লেক ট্রায়াল অ্যাকাউন্ট যুক্ত করবেন:",
      step1: "১. signup.snowflake.com এ একটি ট্রায়াল অ্যাকাউন্ট তৈরি করুন",
      step2: "২. স্নোসাইটে snowflake/schema.sql এক্সিকিউট করে TRAILQR ডেটাবেস ও ভিউ তৈরি করুন",
      step3: "৩. node snowflake/pipeline.js চালিয়ে আসল ডেটা স্ট্রিম করুন",
      tabHotspots: "📍 এলাকাভিত্তিক হটস্পট",
      tabAnomalies: "🛡️ স্টিকার-সোয়াপ অসঙ্গতি",
      tabGemmaFeed: "🤖 জেমা এআই করিডোর",
      tabSqlDdl: "📜 কোকো এসকিউএল ডিডিএল",
      statAudits: "অডিট নথিভুক্ত",
      statThreats: "প্রতারণা প্রতিহত",
      statSafe: "নিরাপদ বিক্রেতা",
      privacy100: "১০০% ক্লায়েন্ট-সাইড"
    },

    hi: {
      brandSub: "स्ट्रीट क्यूआर रक्षा",
      navScanner: "स्कैनर एवं ऑडिट",
      navMap: "खतरा मानचित्र",
      navRegistry: "ऑडिट रजिस्ट्री",
      navSnowflake: "स्नोफ्लेक पाइपलाइन",
      navAbout: "सुरक्षा एवं ट्रैक",
      tagline: "भुगतान करने से पहले किसी भी क्यूआर की जांच करें — चाय की दुकान, कॉलेज और दैनिक लेनदेन के लिए निर्मित।",
      shieldActive: "सुरक्षा कवच सक्रिय",
      audioActive: "ध्वनि सक्रिय",
      audioMuted: "ध्वनि बंद",
      section1Num: "०१",
      section1Title: "आप क्या स्कैन कर रहे हैं?",
      quickScenarios: "दुकान एवं सड़क परिदृश्य (जांच हेतु क्लिक करें):",
      scenarioSafe: "सुरक्षित चाय दुकान",
      scenarioSwap: "स्टिकर-स्वैप धोखाधड़ी",
      scenarioPhish: "फ़िशिंग लिंक क्यूआर",
      scenarioBharat: "कैंपस भारतक्यूआर",
      decodedQrLabel: "डिकोड किया गया क्यूआर टेक्स्ट",
      decodedQrHint: "(पे-लोड पेस्ट करें, फोटो अपलोड करें या कैमरे से स्कैन करें)",
      dropOverlayText: "स्कैन करने के लिए क्यूआर फोटो यहाँ छोड़ें",
      uploadBtn: "📷 फोटो अपलोड",
      pasteBtn: "📋 क्लिपबोर्ड पेस्ट",
      clearBtn: "🧹 साफ़ करें",
      expectedLabel: "दुकान के बोर्ड पर क्या नाम है?",
      expectedHint: "(स्टिकर बदलाव को पकड़ता है)",
      expectedPlaceholder: "उदा: चाय दुकान",
      areaLabel: "इलाका / क्षेत्र",
      areaHint: "(केवल सामान्य इलाका — कभी भी सटीक जीपीएस नहीं)",
      areaPlaceholder: "उदा: रबींद्र सरोवर, कोलकाता",
      checkQrBtn: "यह क्यूआर जांचें",
      uploadQrBtn: "फोटो अपलोड करें",
      scanCameraBtn: "कैमरे से स्कैन करें",
      threatScoreTitle: "धोखाधड़ी जोखिम स्कोर",
      redFlagsTitle: "नियम आधारित खतरे के संकेत:",
      gemmaTitle: "जेम्मा एआई मातृभाषा व्याख्या",
      questTitle: "अन्वेषण क्वेस्ट अनलॉक",
      reportBtn: "धोखाधड़ी क्यूआर रिपोर्ट करें",
      saveSafeBtn: "सुरक्षित क्यूआर सेव करें",
      zeroPiiNote: "शून्य-पीआईआई गोपनीयता: केवल सुरक्षित स्क्रैब्ड जानकारी सहेजी जाती है — क्रिप्टोग्राफिक हैश, इलाका और सुरक्षित आईडी। कभी भी खाता संख्या या जीपीएस नहीं।",
      mapTitle: "ग्लोबल एवं सड़क खतरा मानचित्र",
      mapHint: "शिकायत किए गए क्यूआर खतरे, लाल चेतावनी क्षेत्र और प्रमाणित सुरक्षित दुकानों का इंटरैक्टिव मानचित्र।",
      filterAll: "सभी स्थान",
      filterDanger: "🔴 केवल खतरे के संकेत",
      filterSafe: "🟢 केवल सुरक्षित दुकानें",
      mapLegendDanger: "दर्ज स्टिकर-स्वैप / फ़िशिंग क्षेत्र",
      mapLegendSafe: "प्रमाणित वैध व्यापारी",
      registryTitle: "कम्युनिटी ऑडिट रजिस्ट्री",
      registryHint: "स्नोफ्लेक एक्सपोर्ट हेतु सुरक्षित लोकल ऑडिट लेजर",
      clearRegistryBtn: "🧹 रजिस्ट्री साफ़ करें",
      exportCsvBtn: "स्नोफ्लेक के लिए CSV एक्सपोर्ट",
      registryEmptyText: "अभी तक कोई ऑडिट दर्ज नहीं हुआ है। पहला ऑडिट दर्ज करने के लिए स्कैनर में क्यूआर जांचें।",
      snowflakeTitle: "स्नोफ्लेक पाइपलाइन एवं सिंक स्थिति",
      snowflakeStatusTitle: "स्नोफ्लेक क्लाउड सिंक स्थिति:",
      snowflakeStatusStandby: "🟡 स्टैंडबाय / लोकल कतार मोड",
      snowflakeStatusDesc: "कोई सक्रिय स्नोफ्लेक खाता कनेक्टेड नहीं है। विश्वसनीयता बनाए रखने हेतु क्लाउड सिंक ऑफलाइन कतार मोड में है। हम कोई नकली डमी डेटा नहीं दिखाते। खाता जुड़ने पर snowflake/schema.sql द्वारा डेटा लोड किया जा सकता है।",
      howToConnect: "अपना स्नोफ्लेक ट्रायल खाता कैसे जोड़ें:",
      step1: "१. signup.snowflake.com पर मुफ्त ट्रायल खाता बनाएं",
      step2: "२. स्नोसाइट में snowflake/schema.sql चलाकर डेटाबेस और व्यूज बनाएं",
      step3: "३. node snowflake/pipeline.js चलाकर वास्तविक डेटा स्ट्रीम करें",
      tabHotspots: "📍 इलाका हॉटस्पॉट",
      tabAnomalies: "🛡️ स्टिकर-स्वैप विसंगतियां",
      tabGemmaFeed: "🤖 जेम्मा एआई कॉरिडोर",
      tabSqlDdl: "📜 कोको एसक्यूएल डीडीडीएल",
      statAudits: "ऑडिट दर्ज",
      statThreats: "धोखे रोके गए",
      statSafe: "सुरक्षित व्यापारी",
      privacy100: "१००% क्लाइंट-साइड"
    }
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) lang = "en";
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
    var evt = new CustomEvent("trailqr:langchange", { detail: { lang: lang } });
    window.dispatchEvent(evt);
    return lang;
  }

  function t(key, lang) {
    lang = lang || getLang();
    var dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  function applyTranslations(lang) {
    lang = lang || getLang();
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key, lang);
      if (val) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = val;
        } else {
          el.textContent = val;
        }
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update active class on language switcher buttons
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
  }

  window.TrailQRI18n = {
    getLang: getLang,
    setLang: setLang,
    t: t,
    applyTranslations: applyTranslations,
    TRANSLATIONS: TRANSLATIONS
  };
})();
