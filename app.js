(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var current = null, currentPlace = "";

  // Sample buttons
  (window.TRAILQR_SAMPLES || []).forEach(function (s) {
    var b = document.createElement("button");
    b.textContent = s.label;
    b.addEventListener("click", function () {
      $("payload").value = s.payload;
      $("expected").value = s.expectedName || "";
      $("area").value = s.area || "";
      currentPlace = s.place || "";
      run();
    });
    $("samples").appendChild(b);
  });

  function renderRegistry() {
    var rows = window.TrailQRRegistry.load();
    $("registryEmpty").hidden = rows.length > 0;
    var table = $("registryTable");
    table.hidden = rows.length === 0;
    var tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    rows.forEach(function (r) {
      var tr = document.createElement("tr");
      [r.qr_hash, r.display_name, r.coarse_area, r.verdict, r.score, r.reported ? "⚠️ yes" : "—"].forEach(function (v) {
        var td = document.createElement("td"); td.textContent = v; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  async function run() {
    var raw = $("payload").value.trim();
    if (!raw) { $("scanNote").textContent = "Paste a QR payload or pick a sample first."; return; }
    var area = $("area").value.trim();
    current = window.TrailQR.analyse(raw, $("expected").value.trim(), area);
    var r = current;
    $("resultCard").hidden = false;
    var v = $("verdict");
    v.textContent = r.verdict + " · " + r.score + "/100";
    v.className = "verdict " + r.verdict.toLowerCase();
    $("summary").textContent = "Type: " + r.kind + " · Display name: " + r.displayName +
      (r.maskedPayee ? " · Payee (masked): " + r.maskedPayee : "");
    var ul = $("flags"); ul.innerHTML = "";
    if (!r.flags.length) { var li = document.createElement("li"); li.textContent = "No risk flags raised."; ul.appendChild(li); }
    r.flags.forEach(function (f) {
      var li = document.createElement("li");
      li.textContent = "[" + f.severity.toUpperCase() + " +" + f.points + "] " + f.detail;
      ul.appendChild(li);
    });
    var out = await window.TrailQRGemma.explain(r, currentPlace || area);
    $("explanation").textContent = out.text;
    $("gemmaMode").textContent = "(" + (out.mode === "gemma-live" ? "Gemma 4, live via Gemini API" : "scripted fallback — works offline") + ")";
    var quest = window.TrailQRGemma.quest(r, currentPlace || area);
    $("questBox").hidden = !quest;
    if (quest) $("quest").textContent = quest;
    $("resultCard").scrollIntoView({ behavior: "smooth" });
  }

  $("analyse").addEventListener("click", run);
  $("report").addEventListener("click", function () {
    if (!current) return;
    window.TrailQRRegistry.add(current, true); renderRegistry();
    $("scanNote").textContent = "Reported. A scrubbed row was added to the registry — no raw payload stored.";
  });
  $("saveSafe").addEventListener("click", function () {
    if (!current) return;
    window.TrailQRRegistry.add(current, false); renderRegistry();
  });
  $("exportCsv").addEventListener("click", function () {
    var csv = window.TrailQRRegistry.toCSV(window.TrailQRRegistry.load());
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "trailqr_registry.csv"; a.click();
    URL.revokeObjectURL(a.href);
  });

  // Camera scan — only where BarcodeDetector exists; paste/sample flow always works.
  $("scan").addEventListener("click", async function () {
    if (!("BarcodeDetector" in window) || !navigator.mediaDevices) {
      $("scanNote").textContent = "Camera QR detection isn't supported in this browser — paste the decoded text or use a sample. The demo does not depend on the camera.";
      return;
    }
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      var video = $("video"); video.hidden = false; video.srcObject = stream; await video.play();
      var detector = new BarcodeDetector({ formats: ["qr_code"] });
      $("scanNote").textContent = "Point the camera at a QR…";
      var tick = setInterval(async function () {
        try {
          var codes = await detector.detect(video);
          if (codes && codes.length) {
            clearInterval(tick);
            stream.getTracks().forEach(function (t) { t.stop(); });
            video.hidden = true;
            $("payload").value = codes[0].rawValue || "";
            run();
          }
        } catch (e) { /* keep trying */ }
      }, 400);
    } catch (e) {
      $("scanNote").textContent = "Camera permission denied — paste/sample flow still works.";
    }
  });

  renderRegistry();
})();
