(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var current = null, currentPlace = "";

  // -------------------------------------------------------------
  // Graphite Procedural Audio Engine (thtbee/graphite emulation)
  // Pure Web Audio API: Zero external files or CDNs required
  // -------------------------------------------------------------
  var audioCtx = null;
  var soundEnabled = true;

  function getAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Wooden pencil lead tap on paper
  function playPencilTap() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudio();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (e) {}
  }

  // Soft textured graphite friction sweep
  function playGraphiteSweep() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudio();
      if (!ctx) return;
      var bufferSize = Math.floor(ctx.sampleRate * 0.09);
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      var noise = ctx.createBufferSource();
      noise.buffer = buffer;
      var filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1600;
      filter.Q.value = 1.4;
      var gain = ctx.createGain();
      gain.gain.value = 0.05;
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Sound toggle button handling
  var soundToggle = $("soundToggle");
  if (soundToggle) {
    soundToggle.addEventListener("click", function () {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle("active", soundEnabled);
      var soundIcon = $("soundIcon");
      var soundLabel = $("soundLabel");
      if (soundIcon) soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
      if (soundLabel) soundLabel.textContent = soundEnabled ? "Audio Active" : "Audio Muted";
      if (soundEnabled) playPencilTap();
    });
  }

  // -------------------------------------------------------------
  // Sample Scenarios Rendering
  // -------------------------------------------------------------
  (window.TRAILQR_SAMPLES || []).forEach(function (s, idx) {
    var b = document.createElement("button");
    var icon = idx === 0 ? "🍵" : (idx === 1 ? "⚠️" : "🚨");
    var parts = s.label.split(" — ");
    var title = parts[0] || s.label;
    var sub = parts[1] || "";
    
    b.className = "sample-btn";
    b.innerHTML = '<span style="font-weight:700;display:flex;align-items:center;gap:6px;">' + icon + ' ' + title + '</span>' +
      (sub ? '<span style="font-size:12px;color:var(--chalk-muted);margin-top:2px;">' + sub + '</span>' : '');
    
    b.addEventListener("click", function () {
      playPencilTap();
      var all = $("samples").querySelectorAll("button");
      for (var i = 0; i < all.length; i++) { all[i].classList.remove("active-sample"); }
      b.classList.add("active-sample");

      $("payload").value = s.payload;
      $("expected").value = s.expectedName || "";
      $("area").value = s.area || "";
      currentPlace = s.place || "";
      run();
    });
    $("samples").appendChild(b);
  });

  // -------------------------------------------------------------
  // Input Micro-Actions
  // -------------------------------------------------------------
  var pasteBtn = $("pasteBtn");
  if (pasteBtn) {
    pasteBtn.addEventListener("click", async function () {
      playPencilTap();
      try {
        var text = await navigator.clipboard.readText();
        if (text) {
          $("payload").value = text;
          run();
        }
      } catch (e) {
        $("scanNote").textContent = "Clipboard permission denied. Please paste directly into the box.";
      }
    });
  }

  var clearBtn = $("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      playPencilTap();
      $("payload").value = "";
      $("expected").value = "";
      $("area").value = "";
      $("resultCard").hidden = true;
      var all = $("samples").querySelectorAll("button");
      for (var i = 0; i < all.length; i++) { all[i].classList.remove("active-sample"); }
    });
  }

  function updateStats(rows) {
    var totalAudits = rows.length;
    var threats = rows.filter(function (r) { return r.verdict === "DANGEROUS" || r.reported; }).length;
    var safe = rows.filter(function (r) { return r.verdict === "SAFE" && !r.reported; }).length;
    
    if ($("statTotalAudits")) $("statTotalAudits").textContent = totalAudits;
    if ($("statThreats")) $("statThreats").textContent = threats;
    if ($("statSafe")) $("statSafe").textContent = safe;
  }

  function renderRegistry() {
    var rows = window.TrailQRRegistry.load();
    $("registryEmpty").hidden = rows.length > 0;
    var table = $("registryTable");
    table.hidden = rows.length === 0;
    var tbody = table.querySelector("tbody");
    tbody.innerHTML = "";

    rows.forEach(function (r) {
      var tr = document.createElement("tr");

      var tdHash = document.createElement("td");
      tdHash.innerHTML = '<span class="hash-cell">#' + (r.qr_hash ? r.qr_hash.slice(0, 8) : "") + '</span>';
      tr.appendChild(tdHash);

      var tdName = document.createElement("td");
      tdName.textContent = r.display_name || "—";
      tr.appendChild(tdName);

      var tdArea = document.createElement("td");
      tdArea.textContent = r.coarse_area || "—";
      tr.appendChild(tdArea);

      var tdVerdict = document.createElement("td");
      var vClass = (r.verdict || "").toLowerCase();
      tdVerdict.innerHTML = '<span class="verdict-pill ' + vClass + '">' + r.verdict + '</span>';
      tr.appendChild(tdVerdict);

      var tdScore = document.createElement("td");
      tdScore.textContent = r.score + "/100";
      tr.appendChild(tdScore);

      var tdRep = document.createElement("td");
      tdRep.innerHTML = r.reported 
        ? '<span style="color:var(--signal-danger);font-weight:700;">⚠️ Reported</span>' 
        : '<span style="color:var(--chalk-dim);">Clean</span>';
      tr.appendChild(tdRep);

      tbody.appendChild(tr);
    });

    updateStats(rows);
  }

  // -------------------------------------------------------------
  // Audit Analysis Execution
  // -------------------------------------------------------------
  async function run() {
    var raw = $("payload").value.trim();
    if (!raw) {
      $("scanNote").textContent = "Paste a QR payload or pick a street sample first.";
      return;
    }
    $("scanNote").textContent = "";

    var area = $("area").value.trim();
    current = window.TrailQR.analyse(raw, $("expected").value.trim(), area);
    var r = current;
    $("resultCard").hidden = false;

    playGraphiteSweep();

    // Verdict Badge
    var v = $("verdict");
    var vIcon = r.verdict === "SAFE" ? "🛡️ SAFE" : (r.verdict === "CAUTION" ? "⚠️ CAUTION" : "🚨 DANGEROUS");
    v.innerHTML = vIcon + ' <span style="font-size:16px;opacity:0.85;margin-left:8px;font-family:var(--font-mono);">' + r.score + '/100</span>';
    v.className = "verdict " + r.verdict.toLowerCase();

    // Threat Score Meter
    var scoreTrack = $("scoreTrack");
    var scoreFill = $("scoreFill");
    var scoreText = $("scoreText");
    if (scoreTrack && scoreFill) {
      var pct = Math.min(100, Math.max(0, r.score));
      scoreFill.style.width = pct + "%";
      scoreTrack.className = "score-track " + r.verdict.toLowerCase();
    }
    if (scoreText) {
      scoreText.textContent = r.score + " / 100 — " + r.verdict;
    }

    // Specifications Summary
    $("summary").innerHTML = '<strong>Kind:</strong> <span style="color:var(--signal-cyan);">' + (r.kind || "text").toUpperCase() + '</span> · ' +
      '<strong>Decoded Name:</strong> ' + (r.displayName ? '<strong>' + r.displayName + '</strong>' : '<em>(None)</em>') +
      (r.maskedPayee ? ' · <strong>Masked Payee:</strong> <code style="color:var(--signal-safe);">' + r.maskedPayee + '</code>' : '');

    // Flags Breakdown
    var ul = $("flags");
    ul.innerHTML = "";
    if (!r.flags.length) {
      var li = document.createElement("li");
      li.className = "flag-empty";
      li.innerHTML = '<span class="flag-badge safe">SAFE 0</span> <span>No risk flags raised. Verified against authentic shop heuristics.</span>';
      ul.appendChild(li);
    } else {
      r.flags.forEach(function (f) {
        var li = document.createElement("li");
        var sev = (f.severity || "med").toLowerCase();
        li.className = "flag-item-" + sev;
        li.innerHTML = '<span class="flag-badge ' + sev + '">[' + sev.toUpperCase() + ' +' + f.points + ']</span> <span>' + f.detail + '</span>';
        ul.appendChild(li);
      });
    }

    // Gemma AI Explanation
    var out = await window.TrailQRGemma.explain(r, currentPlace || area);
    $("explanation").textContent = out.text;
    $("gemmaMode").textContent = (out.mode === "gemma-live" ? "Gemma 4 · Live via Gemini API" : "Gemma 4 · Scripted Local Fallback");

    // Safe Quest
    var quest = window.TrailQRGemma.quest(r, currentPlace || area);
    $("questBox").hidden = !quest;
    if (quest) $("quest").textContent = quest;

    $("resultCard").scrollIntoView({ behavior: "smooth" });
  }

  $("analyse").addEventListener("click", function () {
    playPencilTap();
    run();
  });

  $("report").addEventListener("click", function () {
    playPencilTap();
    if (!current) return;
    window.TrailQRRegistry.add(current, true);
    renderRegistry();
    $("scanNote").textContent = "🚨 Reported! A scrubbed row was added to the community registry — zero PII stored.";
  });

  $("saveSafe").addEventListener("click", function () {
    playPencilTap();
    if (!current) return;
    window.TrailQRRegistry.add(current, false);
    renderRegistry();
    $("scanNote").textContent = "🛡️ Verified safe find added to registry (scrubbed hash and masked payee only).";
  });

  $("exportCsv").addEventListener("click", function () {
    playPencilTap();
    var csv = window.TrailQRRegistry.toCSV(window.TrailQRRegistry.load());
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "trailqr_registry.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // Camera QR scan support
  $("scan").addEventListener("click", async function () {
    playPencilTap();
    var cameraBox = $("cameraBox");
    if (!("BarcodeDetector" in window) || !navigator.mediaDevices) {
      $("scanNote").textContent = "Camera QR detection isn't supported in this browser — paste the text or use a street sample above. The demo does not depend on camera hardware.";
      return;
    }
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      var video = $("video");
      if (cameraBox) cameraBox.hidden = false;
      video.hidden = false;
      video.srcObject = stream;
      await video.play();

      var detector = new BarcodeDetector({ formats: ["qr_code"] });
      $("scanNote").textContent = "Targeting QR reticle… point camera directly at code.";
      var tick = setInterval(async function () {
        try {
          var codes = await detector.detect(video);
          if (codes && codes.length) {
            clearInterval(tick);
            stream.getTracks().forEach(function (t) { t.stop(); });
            video.hidden = true;
            if (cameraBox) cameraBox.hidden = true;
            $("payload").value = codes[0].rawValue || "";
            run();
          }
        } catch (e) { /* keep polling */ }
      }, 400);
    } catch (e) {
      if (cameraBox) cameraBox.hidden = true;
      $("scanNote").textContent = "Camera permission denied — paste or choose a street sample above.";
    }
  });

  renderRegistry();
})();
