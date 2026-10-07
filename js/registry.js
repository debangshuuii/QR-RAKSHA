/*
 * Community registry — LOCAL first (localStorage).
 * Only scrubbed rows are ever stored: hash, display name, category,
 * coarse area, verdict, score, masked payee, report flag.
 * Never: raw payload, full payee address, exact GPS, amount paid.
 * The same columns are defined in snowflake/schema.sql so rows can be
 * exported as CSV and loaded into Snowflake unchanged.
 */
(function () {
  "use strict";
  var KEY = "trailqr_registry_v1";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function save(rows) { localStorage.setItem(KEY, JSON.stringify(rows)); }

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

  window.TrailQRRegistry = { load: load, add: add, toCSV: toCSV };
})();
