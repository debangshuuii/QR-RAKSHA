/*
 * Community registry — LOCAL first (localStorage).
 * Only scrubbed rows are ever stored: hash, display name, category,
 * coarse area, verdict, score, masked payee, report flag.
 * Never: raw payload, full payee address, exact GPS, amount paid.
 * The same columns are defined in snowflake/schema.sql so rows can be
 * exported as CSV and loaded into Snowflake unchanged.
 *
 * MLH Snowflake Track Integration:
 * Combines Snowflake CoCo generated views with Cybersyn Marketplace POI data.
 */
(function () {
  "use strict";
  var KEY = "trailqr_registry_v1";

  // Pre-seeded representative POI cache from Snowflake Marketplace (Cybersyn: Point of Interest)
  var CYBERSYN_POI = [
    { poi_id: "POI_KOL_001", merchant_name: "Chai Dukaan", category: "Food & Dining", coarse_area: "Rabindra Sarobar", verified_vpa: "chaidukaan@okhdfcbank" },
    { poi_id: "POI_KOL_002", merchant_name: "Techno Main Salt Lake", category: "Education", coarse_area: "Salt Lake Sector V", verified_vpa: "mab.037135003190033@axisbank" },
    { poi_id: "POI_KOL_003", merchant_name: "College Street Coffee House", category: "Food & Dining", coarse_area: "College Street", verified_vpa: "coffeehouse@sbi" },
    { poi_id: "POI_KOL_004", merchant_name: "Park Street Confectionery", category: "Food & Dining", coarse_area: "Park Street", verified_vpa: "parkstbakery@icici" }
  ];

  // Representative Kolkata street audit telemetry (privacy-scrubbed)
  var DEMO_TELEMETRY = [
    {
      qr_hash: "a1b2c3d4e5f60718",
      display_name: "Chai Dukaan",
      category: "upi",
      coarse_area: "Rabindra Sarobar",
      verdict: "SAFE",
      score: 0,
      payee_masked: "ch***@okhdfcbank",
      reported: false,
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      qr_hash: "f9e8d7c6b5a41234",
      display_name: "Chai Dukaan",
      category: "upi",
      coarse_area: "Rabindra Sarobar",
      verdict: "DANGEROUS",
      score: 75,
      payee_masked: "rk***@paytm",
      reported: true,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      qr_hash: "3344556677889900",
      display_name: "paytm.kyc-verify-login.ru",
      category: "url",
      coarse_area: "Park Street",
      verdict: "DANGEROUS",
      score: 100,
      payee_masked: "",
      reported: true,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      qr_hash: "60fcd364c311d93e",
      display_name: "TECHNO MAIN SALTLAKE",
      category: "upi_merchant",
      coarse_area: "Salt Lake Sector V",
      verdict: "SAFE",
      score: 0,
      payee_masked: "MA***@AXISBANK",
      reported: false,
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      qr_hash: "778899aabbccddee",
      display_name: "College Street Books",
      category: "upi",
      coarse_area: "College Street",
      verdict: "CAUTION",
      score: 35,
      payee_masked: "bo***@upi",
      reported: false,
      created_at: new Date(Date.now() - 600000).toISOString()
    }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }

  function save(rows) {
    localStorage.setItem(KEY, JSON.stringify(rows));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function seedDemoData() {
    save(DEMO_TELEMETRY.slice());
    return load();
  }

  function add(result, reported) {
    var rows = load();
    var row = {
      qr_hash: result.scrubbed.qr_hash,
      display_name: result.scrubbed.display_name,
      category: result.scrubbed.category,
      coarse_area: result.scrubbed.coarse_area,
      verdict: result.scrubbed.verdict,
      score: result.scrubbed.score,
      payee_masked: result.scrubbed.payee_masked || "",
      reported: !!reported,
      created_at: new Date().toISOString()
    };
    var existing = rows.findIndex(function (r) { return r.qr_hash === row.qr_hash; });
    if (existing >= 0) { rows[existing] = Object.assign({}, rows[existing], row); }
    else rows.push(row);
    save(rows);
    return rows;
  }

  function toCSV(rows) {
    var cols = ["qr_hash","display_name","category","coarse_area","verdict","score","payee_masked","reported","created_at"];
    function esc(v) { v = (v === null || v === undefined) ? "" : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    return cols.join(",") + "\n" + rows.map(function (r) { return cols.map(function (c) { return esc(r[c]); }).join(","); }).join("\n");
  }

  // Emulate Snowflake CoCo views in the client for instant local intelligence
  function computeViews(rows) {
    rows = rows || load();

    // 1. Hotspots by area (V_FRAUD_HOTSPOTS_BY_AREA)
    var areaStats = {};
    rows.forEach(function (r) {
      var area = r.coarse_area || "Unspecified Locality";
      if (!areaStats[area]) areaStats[area] = { scans: 0, threats: 0, scores: [] };
      areaStats[area].scans++;
      if (r.verdict === "DANGEROUS" || r.reported) areaStats[area].threats++;
      areaStats[area].scores.push(r.score || 0);
    });

    var hotspots = Object.keys(areaStats).map(function (area) {
      var s = areaStats[area];
      var fraudRate = s.scans > 0 ? (s.threats / s.scans) * 100 : 0;
      var avgScore = s.scores.length > 0 ? s.scores.reduce(function (a, b) { return a + b; }, 0) / s.scores.length : 0;
      return {
        area: area,
        scans: s.scans,
        threats: s.threats,
        fraudRate: fraudRate,
        avgScore: avgScore
      };
    }).sort(function (a, b) { return b.threats - a.threats || b.avgScore - a.avgScore; });

    // 2. Sticker Swap Anomaly Detection (V_STICKER_SWAP_ANOMALIES)
    var norm = function (s) { return (s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); };
    var anomalies = rows.map(function (r) {
      var rArea = (r.coarse_area || "").toLowerCase();
      var rNorm = norm(r.display_name);

      var match = CYBERSYN_POI.find(function (p) {
        var pArea = p.coarse_area.toLowerCase();
        var pNorm = norm(p.merchant_name);
        return pArea === rArea && (pNorm.indexOf(rNorm) !== -1 || rNorm.indexOf(pNorm) !== -1);
      });

      var classification = "";
      var badgeClass = "";
      if (!match) {
        classification = "Unregistered Entity in Locality";
        badgeClass = "dim";
      } else if (r.reported || r.verdict === "DANGEROUS") {
        classification = "🚨 Confirmed Sticker Swap Fraud";
        badgeClass = "danger";
      } else if (rNorm !== norm(match.merchant_name)) {
        classification = "⚠️ Name Mismatch Suspected";
        badgeClass = "caution";
      } else {
        classification = "🛡️ Verified Authentic Merchant";
        badgeClass = "safe";
      }

      return {
        hash: r.qr_hash,
        displayName: r.display_name,
        area: r.coarse_area,
        payeeMasked: r.payee_masked,
        registeredMerchant: match ? match.merchant_name : "None Found",
        classification: classification,
        badgeClass: badgeClass
      };
    });

    // 3. Gemma AI feed (V_GEMMA_AI_NEIGHBOURHOOD_BRIEF)
    var gemmaFeed = hotspots.map(function (h) {
      var tier = h.fraudRate >= 50 ? "HIGH_RISK_CORRIDOR" : (h.fraudRate >= 20 ? "ELEVATED_CAUTION" : "GENERALLY_SAFE");
      var swaps = anomalies.filter(function (a) {
        return a.area === h.area && (a.classification.indexOf("Sticker Swap") !== -1 || a.classification.indexOf("Mismatch") !== -1);
      }).length;
      return {
        area: h.area,
        securityTier: tier,
        fraudRate: h.fraudRate.toFixed(1) + "%",
        avgScore: h.avgScore.toFixed(1),
        swapIncidents: swaps
      };
    });

    return {
      hotspots: hotspots,
      anomalies: anomalies,
      gemmaFeed: gemmaFeed,
      poiCatalog: CYBERSYN_POI
    };
  }

  window.TrailQRRegistry = {
    load: load,
    save: save,
    clear: clear,
    add: add,
    toCSV: toCSV,
    seedDemoData: seedDemoData,
    computeViews: computeViews,
    CYBERSYN_POI: CYBERSYN_POI
  };
})();
